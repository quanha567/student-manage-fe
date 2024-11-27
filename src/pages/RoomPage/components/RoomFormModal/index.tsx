import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import { Modal } from 'antd'

import {
    FormInput,
    FormInputNumber,
    FormSelect,
    FormTextArea,
} from '@/components'
import { ROOM_TYPE_OPTIONS } from '@/constants/roomConstant'
import { useGetRoomDetail } from '@/queries'
import { DisclosureType } from '@/types'

import { useRoomForm } from './useRoomForm'

type RoomFormModalProps = DisclosureType & {
    onRefetch: () => Promise<unknown>
}

export const RoomFormModal = ({
    isOpen,
    toggleOpen,
    id: classId,
    onRefetch,
}: RoomFormModalProps) => {
    const { createOrUpdate, formMethods } = useRoomForm(
        classId,
        toggleOpen,
        onRefetch,
    )

    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data: classDetail, isLoading: isLoadingRoom } = useGetRoomDetail(
        Number(classId),
    )

    useEffect(() => {
        if (classId && classDetail) {
            reset({
                data: {
                    ...classDetail.data?.attributes,
                },
            })
        } else {
            reset({
                data: { name: '' },
            })
        }
    }, [classDetail, classId, reset])

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => {
                toggleOpen('')
            }}
            maskClosable
            closable
            okText={classId ? 'Lưu thay đổi' : 'Thêm mới'}
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
                disabled: Boolean(!isDirty && classId),
            }}
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {classId
                        ? 'Cập nhật thông tin phòng học'
                        : 'Thêm phòng học mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
                body: 'space-y-4',
            }}
            loading={Boolean(isLoadingRoom && classId)}
        >
            <FormProvider {...formMethods}>
                <FormInput
                    required
                    label="Tên phòng học"
                    name="data.name"
                    placeholder="Nhập tên phòng học"
                />
                <FormInputNumber
                    label="Số lượng chỗ"
                    name="data.capacity"
                    placeholder="Nhập số lượng chổ ngồi"
                />
                <FormSelect
                    label="Loại phòng"
                    name="data.type"
                    options={ROOM_TYPE_OPTIONS}
                    placeholder="- Chọn loại phòng -"
                />
                <FormTextArea
                    label="Vị trí"
                    name="data.location"
                    placeholder="Nhập vị trí lớp học"
                />
            </FormProvider>
        </Modal>
    )
}
