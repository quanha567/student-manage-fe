import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string } from 'yup'

import { App } from 'antd'

import { QUERY_KEYS } from '@/constants'
import { queryClient } from '@/providers'
import {
    DepartmentCreateRequest,
    departmentService,
    fileService,
} from '@/services'

const formDepartmentValidate: ObjectSchema<DepartmentCreateRequest> =
    object().shape({
        data: object({
            departmentName: string().required('Vui lòng nhập tên khoa!'),
        }),
    })

export const useDepartmentForm = (
    departmentId?: string,
    closeModel?: () => void,
) => {
    const formMethods = useForm<DepartmentCreateRequest>({
        resolver: yupResolver(formDepartmentValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateDepartment = useCallback(
        async (data: DepartmentCreateRequest) => {
            try {
                let dataSubmit = { ...data }

                if (data.data?.avatar instanceof Blob) {
                    const formData = new FormData()

                    formData.append('files', data.data.avatar)
                    const imageUploaded =
                        await fileService.uploadFiles(formData)
                    dataSubmit = {
                        ...dataSubmit,
                        data: {
                            ...dataSubmit.data,
                            avatar: imageUploaded[0]?.id ?? '',
                        },
                    }
                } else if (dataSubmit.data?.avatar !== null) {
                    delete dataSubmit.data?.avatar
                }

                if (departmentId) {
                    await departmentService.update(
                        Number(departmentId),
                        dataSubmit,
                    )
                } else {
                    await departmentService.create(dataSubmit)
                }
                await queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.DEPARTMENT_LIST],
                })
                notification.success({
                    message: departmentId
                        ? 'Cập nhật thông tin khoa thành công'
                        : 'Thêm khoa mới thành công!',
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
        [departmentId, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateDepartment),
    } as const
}
