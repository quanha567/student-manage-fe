import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import { Modal } from 'antd'

import { FormInput, FormTextArea } from '@/components'
import { useGetCourseDetail } from '@/queries'
import { DisclosureType } from '@/types'

import { useCourseForm } from './useCourseForm'

type CourseFormModalProps = DisclosureType

export const CourseFormModal = ({
    isOpen,
    toggleOpen,
    id,
}: CourseFormModalProps) => {
    const { createOrUpdate, formMethods } = useCourseForm(id, toggleOpen)

    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data, isLoading } = useGetCourseDetail(Number(id))

    useEffect(() => {
        if (id && data && isOpen) {
            reset({
                data: {
                    ...data.data?.attributes,
                },
            })
        } else {
            reset({
                data: {
                    name: '',
                },
            })
        }
    }, [data, id, reset, isOpen])

    return (
        <Modal
            centered
            closable
            maskClosable
            open={isOpen}
            onCancel={() => toggleOpen()}
            okText={id ? 'Lưu thay đổi' : 'Thêm mới'}
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
                disabled: Boolean(!isDirty && id),
            }}
            className="!w-full xl:max-w-[50%]"
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {id ? 'Cập nhật thông tin đề cương' : 'Thêm đề cương mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
            }}
            loading={Boolean(isLoading && id)}
        >
            <FormProvider {...formMethods}>
                <FormInput
                    required
                    label="Tên đề cương"
                    name="data.name"
                    placeholder="Nhập tên đề cương"
                />
                <FormTextArea
                    allowClear
                    rows={4}
                    label="Mô tả"
                    name="data.description"
                    placeholder="Nhập mô tả đề cương"
                />
            </FormProvider>
        </Modal>
    )
}
