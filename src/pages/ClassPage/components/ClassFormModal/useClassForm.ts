import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string } from 'yup'

import { App } from 'antd'

import { ClassModel } from '@/models'
import { classService } from '@/services'
import { CreateRequest } from '@/types'

const formClassValidate: ObjectSchema<CreateRequest<ClassModel>> =
    object().shape({
        data: object({
            className: string().required('Vui lòng nhập tên lớp học!'),
        }),
    })

export const useClassForm = (
    classId?: string,
    closeModel?: () => void,
    refetch?: () => Promise<any>,
) => {
    const formMethods = useForm<CreateRequest<ClassModel>>({
        resolver: yupResolver(formClassValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateClass = useCallback(
        async (data: CreateRequest<ClassModel>) => {
            try {
                const dataSubmit = { ...data }

                if (classId) {
                    await classService.update(Number(classId), dataSubmit)
                } else {
                    await classService.create(dataSubmit)
                }
                await refetch?.()
                notification.success({
                    message: classId
                        ? 'Cập nhật thông tin lớp học thành công'
                        : 'Thêm lớp học mới thành công!',
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
        [classId, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateClass),
    } as const
}
