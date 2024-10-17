import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { ObjectSchema, object, string } from 'yup'

import { App } from 'antd'

import {
    SubjectCreateRequest,
    SubjectListResponse,
    subjectService,
} from '@/services'

const formSubjectValidate: ObjectSchema<SubjectCreateRequest> = object().shape({
    data: object({
        name: string().required('Vui lòng nhập tên môn học!'),
    }),
})

export const useSubjectForm = (
    subjectId?: string,
    closeModel?: () => void,
    refetchData?: (
        options?: RefetchOptions,
    ) => Promise<QueryObserverResult<SubjectListResponse>>,
) => {
    const formMethods = useForm<SubjectCreateRequest>({
        resolver: yupResolver(formSubjectValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateSubject = useCallback(
        async (data: SubjectCreateRequest) => {
            try {
                const dataSubmit = { ...data }

                if (subjectId)
                    await subjectService.update(Number(subjectId), dataSubmit)
                else await subjectService.create(dataSubmit)

                await refetchData?.()
                notification.success({
                    message: subjectId
                        ? 'Cập nhật thông tin môn học thành công'
                        : 'Thêm môn học mới thành công!',
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
        [subjectId, refetchData, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateSubject),
    } as const
}
