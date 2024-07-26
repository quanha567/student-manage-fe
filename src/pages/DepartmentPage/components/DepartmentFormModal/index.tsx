import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import { Modal } from 'antd'

import { FormInput, FormSingleUpload } from '@/components'
import { useGetDepartmentDetail } from '@/hooks'
import { ImageModel } from '@/models'
import { DisclosureType } from '@/types'
import { getPreviewUrl } from '@/utils'

import { useDepartmentForm } from './useDepartmentForm'

type DepartmentFormModalProps = DisclosureType

export const DepartmentFormModal = ({
    isOpen,
    toggleOpen,
    id: departmentId,
}: DepartmentFormModalProps) => {
    const { createOrUpdate, formMethods } = useDepartmentForm(
        departmentId,
        toggleOpen,
    )
    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data: departmentDetail, isLoading: isLoadingDepartment } =
        useGetDepartmentDetail(Number(departmentId))

    useEffect(() => {
        if (departmentId && departmentDetail) {
            reset({
                data: {
                    ...departmentDetail.data?.attributes,
                    avatar: getPreviewUrl(
                        departmentDetail.data?.attributes.avatar as ImageModel,
                    ),
                },
            })
        } else {
            reset({
                data: { departmentName: '', avatar: undefined },
            })
        }
    }, [departmentDetail, departmentId, reset])

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => {
                toggleOpen()
            }}
            maskClosable
            closable
            okText={departmentId ? 'Lưu thay đổi' : 'Thêm mới'}
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
                disabled: Boolean(!isDirty && departmentId),
            }}
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {departmentId ? 'Cập nhật thông tin khoa' : 'Thêm khoa mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
                body: 'space-y-4',
            }}
            loading={Boolean(isLoadingDepartment && departmentId)}
        >
            <FormProvider {...formMethods}>
                <FormSingleUpload label="Hình ảnh" name="data.avatar" />
                <FormInput
                    required
                    label="Tên khoa"
                    name="data.departmentName"
                    placeholder="Nhập tên khoa"
                />
            </FormProvider>
        </Modal>
    )
}
