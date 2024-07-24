import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { App } from 'antd'

import { QUERY_KEYS } from '@/constants'
import { queryClient } from '@/main'
import { DepartmentModel } from '@/models'
import { departmentService } from '@/services'

export const useDepartmentForm = (departmentId?: string) => {
    const formMethods = useForm<DepartmentModel>()

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateDepartment = useCallback(
        async (data: DepartmentModel) => {
            try {
                if (departmentId)
                    await departmentService.update(departmentId, data)
                else await departmentService.create(data)
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.DEPARTMENTS],
                })
                notification.success({
                    message: 'Thêm khoa mới thành công!',
                })
            } catch (err: unknown) {
                console.log('err', err)
                notification.error({
                    message: 'Có lỗi xảy ra vui lòng thử lại sau!',
                })
            }
        },
        [notification, departmentId],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateDepartment),
    } as const
}
