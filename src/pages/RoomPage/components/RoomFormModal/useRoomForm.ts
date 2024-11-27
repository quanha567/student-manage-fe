import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string } from 'yup'

import { App } from 'antd'

import { RoomModel } from '@/models'
import { roomService } from '@/services'
import { CreateRequest } from '@/types'

const formRoomValidate: ObjectSchema<CreateRequest<RoomModel>> = object().shape(
    {
        data: object({
            name: string().required('Vui lòng nhập tên phòng học!'),
        }),
    },
)

export const useRoomForm = (
    roomId?: string,
    closeModel?: () => void,
    refetch?: () => Promise<unknown>,
) => {
    const formMethods = useForm<CreateRequest<RoomModel>>({
        resolver: yupResolver(formRoomValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateRoom = useCallback(
        async (data: CreateRequest<RoomModel>) => {
            try {
                const dataSubmit = { ...data }

                if (roomId) {
                    await roomService.update(Number(roomId), dataSubmit)
                } else {
                    await roomService.create(dataSubmit)
                }
                await refetch?.()
                notification.success({
                    message: roomId
                        ? 'Cập nhật thông tin phòng học thành công'
                        : 'Thêm phòng học mới thành công!',
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
        [roomId, notification, closeModel],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateRoom),
    } as const
}
