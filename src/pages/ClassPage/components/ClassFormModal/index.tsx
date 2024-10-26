import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import { Modal } from 'antd'

import { FormInput } from '@/components'
import { useGetClassDetail } from '@/queries'
import { DisclosureType } from '@/types'

import { useClassForm } from './useClassForm'

type ClassFormModalProps = DisclosureType & {
    onRefetch: () => Promise<any>
}

export const ClassFormModal = ({
    isOpen,
    toggleOpen,
    id: classId,
    onRefetch,
}: ClassFormModalProps) => {
    const { createOrUpdate, formMethods } = useClassForm(
        classId,
        toggleOpen,
        onRefetch,
    )

    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data: classDetail, isLoading: isLoadingClass } = useGetClassDetail(
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
                data: { className: '' },
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
                        ? 'Cập nhật thông tin lớp học'
                        : 'Thêm lớp học mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
                body: 'space-y-4',
            }}
            loading={Boolean(isLoadingClass && classId)}
        >
            <FormProvider {...formMethods}>
                <FormInput
                    required
                    label="Tên lớp học"
                    name="data.className"
                    placeholder="Nhập tên lớp học"
                />
            </FormProvider>
        </Modal>
    )
}
