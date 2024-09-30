import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string } from 'yup'

import { App } from 'antd'

import { QUERY_KEYS } from '@/constants'
import { queryClient } from '@/providers'
import { SyllabusCreateRequest, syllabusService } from '@/services'

const formSyllabusValidate: ObjectSchema<SyllabusCreateRequest> =
    object().shape({
        data: object({
            name: string().required('Vui lòng nhập tên đề cương!'),
        }),
    })

export const useSyllabusForm = (
    subjectId?: string,
    closeModel?: () => void,
) => {
    const formMethods = useForm<SyllabusCreateRequest>({
        resolver: yupResolver(formSyllabusValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateSyllabus = useCallback(
        async (data: SyllabusCreateRequest) => {
            try {
                const dataSubmit = { ...data }

                if (subjectId)
                    await syllabusService.update(Number(subjectId), dataSubmit)
                else await syllabusService.create(dataSubmit)

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
        createOrUpdate: handleSubmit(handleCreateOrUpdateSyllabus),
    } as const
}
