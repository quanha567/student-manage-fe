import { FormProvider } from 'react-hook-form'

import { Modal } from 'antd'

import { FormInput } from '@/components'
import { DisclosureType } from '@/types'

import { useDepartmentForm } from './useDepertmentForm'

type DepartmentFormModalProps = DisclosureType

export const DepartmentFormModal = ({
    isOpen,
    toggleOpen,
    id: departmentId,
}: DepartmentFormModalProps) => {
    const { createOrUpdate, formMethods } = useDepartmentForm(departmentId)

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => {
                toggleOpen()
            }}
            maskClosable
            closable
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
            }}
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    Thêm khoa mới
                </p>
            }
            classNames={{
                header: 'text-2xl',
                body: 'space-y-4',
            }}
        >
            <FormProvider {...formMethods}>
                <FormInput
                    name="data.departmentName"
                    label="Tên khoa"
                    placeholder="Nhập tên khoa"
                />
            </FormProvider>
        </Modal>
    )
}
