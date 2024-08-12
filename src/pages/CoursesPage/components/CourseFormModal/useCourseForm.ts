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

import { QUERY_KEYS } from '@/constants'
import { CourseType } from '@/models'
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
        semester: string().required('Vui lòng nhập học kỳ của học phần!'),
        sections: array().of(
            object().shape({
                capacity: number()
                    .required('Vui lòng nhập số lượng sinh viên!')
                    .min(
                        1,
                        'Số lượng sinh viên của lớp học phải lớn hơn bằng 1!',
                    ),
                classroom: string().required(
                    'Vui lòng nhập tên phòng học cho lớp!',
                ),
            }),
        ),
    }),
})

const formCourseDefaultValue: CourseCreateRequest = {
    data: {
        courseType: CourseType.REQUIRED,
        name: '',
        credits: 1,
        labHours: 0,
        lectureHours: 0,
        semester: '',
        startDate: dayjs(),
    },
}

export const useCourseForm = (subjectId?: string, closeModel?: () => void) => {
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

    const { prepend: appendNewSectionSchedule, remove: removeSectionSchedule } =
        useFieldArray({
            control,
            name: 'data.sections.schedules',
        })

    const handleCreateOrUpdateCourse = useCallback(
        async (data: CourseCreateRequest) => {
            try {
                const dataSubmit = { ...data }

                if (
                    !(
                        Array.isArray(dataSubmit.data?.sections) &&
                        dataSubmit.data.sections.length > 0
                    )
                ) {
                    notification.error({
                        message: 'Vui lòng thêm ít nhất một lớp học phần!',
                    })
                    return
                }

                if (subjectId)
                    await courseService.update(Number(subjectId), dataSubmit)
                else {
                    const courseCreated = await courseService.create({
                        data: {
                            ...dataSubmit.data,
                            sections: [],
                        },
                    })

                    if (courseCreated.data?.id) {
                        await Promise.all(
                            dataSubmit.data.sections.map((section) =>
                                sectionService.create({
                                    data: {
                                        ...section,
                                        course: courseCreated.data?.id,
                                    },
                                }),
                            ),
                        )
                    }
                }

                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.SYLLABUS_LIST],
                })
                notification.success({
                    message: subjectId
                        ? 'Cập nhật thông tin đề cương thành công'
                        : 'Thêm đề cương mới thành công!',
                })
            } catch (err: unknown) {
                console.log('err', err)
                notification.error({
                    message: 'Có lỗi xảy ra vui lòng thử lại sau!',
                })
            } finally {
                closeModel?.()
            }
        },
        [subjectId, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateCourse),
        appendNewSection,
        removeSection,
        sectionList,
        appendNewSectionSchedule,
        removeSectionSchedule,
    } as const
}
