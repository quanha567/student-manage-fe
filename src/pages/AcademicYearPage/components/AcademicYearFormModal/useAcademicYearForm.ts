import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string } from 'yup'

import { App } from 'antd'

import { AcademicYearModel } from '@/models'
import { academicYearService } from '@/services'
import { CreateRequest } from '@/types'

const formAcademicYearValidate: ObjectSchema<CreateRequest<AcademicYearModel>> =
    object().shape({
        data: object({
            name: string().required('Vui lòng nhập tên niên khóa!'),
        }),
    })

export const useAcademicYearForm = (
    academicYearId?: string,
    closeModel?: () => void,
    refetch?: () => Promise<any>,
) => {
    const formMethods = useForm<CreateRequest<AcademicYearModel>>({
        resolver: yupResolver(formAcademicYearValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateAcademicYear = useCallback(
        async (data: CreateRequest<AcademicYearModel>) => {
            try {
                const dataSubmit = { ...data }

                if (academicYearId) {
                    await academicYearService.update(
                        Number(academicYearId),
                        dataSubmit,
                    )
                } else {
                    await academicYearService.create(dataSubmit)
                }
                await refetch?.()
                notification.success({
                    message: academicYearId
                        ? 'Cập nhật thông tin niên khóa thành công'
                        : 'Thêm niên khóa mới thành công!',
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
        [academicYearId, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateAcademicYear),
    } as const
}
