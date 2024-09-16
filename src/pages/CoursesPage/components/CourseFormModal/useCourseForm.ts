import { useCallback } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import {
    ObjectSchema,
    array,
    date,
    mixed,
    number,
    object,
    ref,
    string,
} from 'yup'

import { App } from 'antd'

import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { CourseType, SectionSchedule } from '@/models'
import { queryClient } from '@/providers'
import { CourseCreateRequest, courseService, sectionService } from '@/services'

const formCourseValidate: ObjectSchema<CourseCreateRequest> = object().shape({
    data: object({
        name: string().required('Vui lòng nhập tên học phần!'),
        subject: number().required('Vui lòng chọn môn học!'),
        classes: array()
            .of(number())
            .required('Vui lòng chọn ít nhất một lớp đăng ký!'),
        credits: number()
            .required('Vui lòng nhập số tín chỉ!')
            .min(1, 'Số tín chỉ phải lớn hơn bằng 1!'),
        labHours: number()
            .required('Vui lòng nhập số tiết thực hành!')
            .min(0, 'Số tiết thực hành phải lớn hơn bằng 0!'),
        lectureHours: number()
            .required('Vui lòng nhập số tiết lý thuyết!')
            .min(0, 'Số tiết lý thuyết phải lớn hơn bằng 0!'),
        startDate: date().required('Vui lòng chọn ngày bắt đầu học phần!'),
        endDate: date()
            .required('Vui lòng chọn ngày kết thúc học phần!')
            .min(
                ref('startDate'),
                'Ngày kết thúc học phần phải lớn hơn ngày bắt đầu học phần!',
            ),
        courseType: mixed<CourseType>()
            .oneOf(Object.values(CourseType))
            .required('Vui lòng chọn loại học phần!'),
        semester: number().required('Vui lòng nhập học kỳ của học phần!'),
        sections: array()
            .of(
                object().shape({
                    capacity: number()
                        .required('Vui lòng nhập số lượng sinh viên!')
                        .min(
                            1,
                            'Số lượng sinh viên của lớp học phải lớn hơn bằng 1!',
                        ),
                    schedules: array()
                        .of(
                            object().shape({
                                room: string().required(
                                    'Vui lòng nhập tên phòng học!',
                                ),
                                day: string().required(
                                    'Vui chọn một thứ trong tuần!',
                                ),
                                startTime: date()
                                    .required(
                                        'Vui lòng chọn thời gian bắt đầu!',
                                    )
                                    .typeError(
                                        'Vui lòng chọn thời gian bắt đầu!',
                                    ),
                                endTime: date()
                                    .required(
                                        'Vui lòng chọn thời gian kết thúc!',
                                    )
                                    .typeError(
                                        'Vui lòng chọn thời gian kết thúc!',
                                    )
                                    .test(
                                        'is-endTime-after-startTime',
                                        'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
                                        function (value: unknown) {
                                            const { startTime } = this.parent
                                            if (startTime && value) {
                                                return value > startTime
                                            }
                                            return true // If no startTime or endTime, no error
                                        },
                                    ),
                            }),
                        )
                        .min(
                            1,
                            'Vui lòng thêm ít nhất một thời gian học của lớp này!',
                        ),
                }),
            )
            .min(1, 'Vui lòng thêm ít nhất một lớp học phần!'),
    }),
})

const formCourseDefaultValue: CourseCreateRequest = {
    data: {
        courseType: CourseType.REQUIRED,
        name: '',
        credits: 0,
        labHours: 0,
        lectureHours: 0,
        semester: null,
        startDate: dayjs(),
        sections: [
            {
                capacity: 0,
                schedules: [
                    {
                        day: undefined,
                        room: '',
                        startTime: '',
                        endTime: '',
                    },
                ],
            },
        ],
    },
}

export const useCourseForm = (courseId?: string, closeModel?: () => void) => {
    const formMethods = useForm<CourseCreateRequest>({
        resolver: yupResolver(formCourseValidate),
        defaultValues: formCourseDefaultValue,
    })

    const { notification } = App.useApp()

    const { handleSubmit, control } = formMethods

    const {
        prepend: appendNewSection,
        remove: removeSection,
        fields: sectionList,
    } = useFieldArray({
        control,
        name: 'data.sections',
    })

    const formatSchedules = (
        schedules?: SectionSchedule[],
    ): SectionSchedule[] =>
        schedules?.map((schedule) => ({
            ...schedule,
            startTime: schedule.startTime
                ? dayjs(schedule.startTime).format(DATE_TIME_FORMAT.TIME_ONLY)
                : '',
            endTime: schedule.endTime
                ? dayjs(schedule.endTime).format(DATE_TIME_FORMAT.TIME_ONLY)
                : '',
        })) ?? []

    const handleCreateOrUpdateCourse = useCallback(
        async (data: CourseCreateRequest) => {
            if (
                !Array.isArray(data.data?.sections) ||
                data.data.sections.length === 0
            ) {
                return
            }

            const dataSubmit: CourseCreateRequest = {
                ...data,
                data: {
                    ...data.data,
                    sections: data.data.sections
                        .map((section) => ({
                            ...section,
                            schedules: formatSchedules(section.schedules),
                            course: courseId ? Number(courseId) : undefined,
                        }))
                        .filter((section) => section.id),
                },
            }

            try {
                if (courseId) {
                    // Update existing course and sections
                    const courseUpdated = await courseService.update(
                        Number(courseId),
                        dataSubmit,
                    )

                    await Promise.all(
                        data.data.sections.map((section) =>
                            section.id
                                ? sectionService.update(section.id, {
                                      data: {
                                          ...section,
                                          course: courseUpdated.data?.id,
                                          schedules: formatSchedules(
                                              section.schedules,
                                          ),
                                      },
                                  })
                                : sectionService.create({
                                      data: {
                                          ...section,
                                          course: courseUpdated.data?.id,
                                          schedules: formatSchedules(
                                              section.schedules,
                                          ),
                                      },
                                  }),
                        ),
                    )
                } else {
                    // Create new course and sections
                    const courseCreated = await courseService.create({
                        data: {
                            ...dataSubmit.data,
                            sections: [],
                        },
                    })

                    if (courseCreated.data?.id) {
                        await Promise.all(
                            data.data.sections.map((section) =>
                                sectionService.create({
                                    data: {
                                        ...section,
                                        course: courseCreated.data?.id,
                                        schedules: formatSchedules(
                                            section.schedules,
                                        ),
                                    },
                                }),
                            ),
                        )
                    }
                }

                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.COURSE_LIST],
                })

                notification.success({
                    message: courseId
                        ? 'Cập nhật thông tin học phần thành công'
                        : 'Thêm học phần mới thành công!',
                })
            } catch (err: unknown) {
                console.error('Error:', err)
                notification.error({
                    message: 'Có lỗi xảy ra vui lòng thử lại sau!',
                })
            } finally {
                closeModel?.()
            }
        },
        [courseId, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateCourse),
        appendNewSection,
        removeSection,
        sectionList,
    } as const
}
