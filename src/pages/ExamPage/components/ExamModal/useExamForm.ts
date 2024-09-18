import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ObjectSchema, date, mixed, number, object, string } from 'yup'

import { App } from 'antd'

import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { ExamType } from '@/models'
import { ExamCreateRequest, examService } from '@/services'
import { formatDateTime } from '@/utils'

const formExamValidate: ObjectSchema<ExamCreateRequest> = object().shape({
    data: object({
        examName: string().required('Vui lòng nhập tên bài thi, kỳ thi!'),
        examDate: date()
            .required('Vui lòng chọn thời gian diễn ra!')
            .min(
                new Date(Date.now() + 1 * 60 * 1000),
                'Thời gian diễn ra phải lớn hơn hoặc bằng hiện tại!',
            ),
        type: mixed<ExamType>()
            .oneOf(Object.values(ExamType))
            .required('Vui lòng chọn loại bài kiểm tra, bài thi!'),
        course: number().required('Vui lòng chọn môn học!'),
    }),
})

const defaultFormValue: ExamCreateRequest = {
    data: {
        examName: '',
        type: ExamType.FIFTEEN_MINUTE,
        course: 0,
        examDate: dayjs(),
    },
}

export const useExamForm = (examId?: string, closeModel?: () => void) => {
    const formMethods = useForm<ExamCreateRequest>({
        resolver: yupResolver(formExamValidate),
        defaultValues: defaultFormValue,
    })
    const queryClient = useQueryClient()

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateExam = useCallback(
        async (data: ExamCreateRequest) => {
            try {
                const dataSubmit: ExamCreateRequest = {
                    data: {
                        ...data.data,
                        examDate: formatDateTime(
                            String(data.data?.examDate),
                            DATE_TIME_FORMAT.DATE_TIME_WITH_TIMEZONE,
                        ),
                        course: Number(data.data?.course),
                        examName: String(data.data?.examName),
                        type: data.data?.type ?? ExamType.FIFTEEN_MINUTE,
                    },
                }

                if (examId) await examService.update(Number(examId), dataSubmit)
                else await examService.create(dataSubmit)

                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.SEMESTER_LIST],
                })
                notification.success({
                    message: examId
                        ? 'Cập nhật thông tin bài kiểm tra, bài thi thành công'
                        : 'Thêm học bài kiểm tra, bài thi mới thành công!',
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
        [examId, queryClient, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateExam),
    } as const
}
