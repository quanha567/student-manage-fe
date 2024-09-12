import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient } from '@tanstack/react-query'
import { ObjectSchema, date, object, ref, string } from 'yup'

import { App } from 'antd'

import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { SemesterCreateRequest, semesterService } from '@/services'
import { formatDateTime } from '@/utils'

const formSemesterValidate: ObjectSchema<SemesterCreateRequest> =
    object().shape({
        data: object({
            name: string().required('Vui lòng nhập tên học kỳ!'),
            startDate: date().required('Vui lòng chọn thời gian bắt đầu!'),
            endDate: date()
                .required('Vui lòng chọn thời gian kết thúc!')
                .min(
                    ref('startDate'),
                    'Thời gian kết thúc phải lớn hơn thời gian bắt đầu!',
                ),
        }),
    })

export const useSemesterForm = (
    semesterId?: string,
    closeModel?: () => void,
) => {
    const formMethods = useForm<SemesterCreateRequest>({
        resolver: yupResolver(formSemesterValidate),
    })
    const queryClient = useQueryClient()

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateSemester = useCallback(
        async (data: SemesterCreateRequest) => {
            try {
                const dataSubmit: SemesterCreateRequest = {
                    data: {
                        ...data.data,
                        startDate: formatDateTime(
                            String(data.data?.startDate),
                            DATE_TIME_FORMAT.DATE_ONLY_REVERSE_HYPHEN,
                        ),
                        endDate: formatDateTime(
                            String(data.data?.endDate),
                            DATE_TIME_FORMAT.DATE_ONLY_REVERSE_HYPHEN,
                        ),
                        name: String(data.data?.name),
                    },
                }

                if (semesterId)
                    await semesterService.update(Number(semesterId), dataSubmit)
                else await semesterService.create(dataSubmit)

                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.SEMESTER_LIST],
                })
                notification.success({
                    message: semesterId
                        ? 'Cập nhật thông tin học kỳ học thành công'
                        : 'Thêm học kỳ học mới thành công!',
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
        [semesterId, queryClient, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateSemester),
    } as const
}
