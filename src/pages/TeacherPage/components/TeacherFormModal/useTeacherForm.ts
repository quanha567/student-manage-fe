import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { HttpStatusCode, isAxiosError } from 'axios'
import { isDayjs } from 'dayjs'
import { ObjectSchema, object, string } from 'yup'

import { App } from 'antd'

import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { queryClient } from '@/providers'
import { TeacherCreateRequest, fileService, teacherService } from '@/services'

const formTeacherValidate: ObjectSchema<TeacherCreateRequest> = object().shape({
    data: object({
        fullName: string().required('Vui lòng nhập tên giảng viên!'),
    }),
})

export const useTeacherForm = (teacherId?: string, closeModel?: () => void) => {
    const formMethods = useForm<TeacherCreateRequest>({
        resolver: yupResolver(formTeacherValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateTeacher = useCallback(
        async (data: TeacherCreateRequest) => {
            try {
                let dataSubmit: TeacherCreateRequest = {
                    data: {
                        ...data.data,
                        dateOfBirth:
                            data.data?.dateOfBirth &&
                            isDayjs(data.data.dateOfBirth)
                                ? data.data.dateOfBirth.format(
                                      DATE_TIME_FORMAT.DATE_ONLY_REVERSE_HYPHEN,
                                  )
                                : undefined,
                    },
                }

                if (data.data?.avatar instanceof Blob) {
                    const formData = new FormData()

                    formData.append('files', data.data.avatar)
                    const imageUploaded =
                        await fileService.uploadFiles(formData)
                    dataSubmit = {
                        data: {
                            ...dataSubmit.data,
                            avatar: imageUploaded[0]?.id ?? '',
                        },
                    }
                } else if (dataSubmit.data?.avatar !== null) {
                    delete dataSubmit.data?.avatar
                }

                if (teacherId)
                    await teacherService.update(Number(teacherId), dataSubmit)
                else await teacherService.create(dataSubmit)

                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.TEACHER_LIST],
                })
                notification.success({
                    message: teacherId
                        ? 'Cập nhật thông tin giảng viên thành công'
                        : 'Thêm giảng viên mới thành công!',
                })
                closeModel?.()
            } catch (err: unknown) {
                console.log('err', err)
                if (
                    isAxiosError(err) &&
                    err.response?.status === HttpStatusCode.BadRequest
                ) {
                    formMethods.setError('data.email', {
                        type: 'validate',
                        message: 'Email này đã được sử dụng!',
                    })
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
                    })
                    closeModel?.()
                }
            }
        },
        [teacherId, notification, closeModel, formMethods],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateTeacher),
    } as const
}
