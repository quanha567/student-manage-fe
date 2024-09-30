import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import dayjs from 'dayjs'

import { Modal } from 'antd'

import {
    FormDatePicker,
    FormInput,
    FormSelect,
    FormSingleUpload,
    FormTextArea,
} from '@/components'
import { GENDER_OPTIONS } from '@/constants'
import { useClassOptions, useGetTeacherDetail } from '@/queries'
import { DisclosureType } from '@/types'
import { getPreviewUrl } from '@/utils'

import { useTeacherForm } from './useTeacherForm'

type TeacherFormModalProps = DisclosureType

export const TeacherFormModal = ({
    isOpen,
    toggleOpen,
    id,
}: TeacherFormModalProps) => {
    const { createOrUpdate, formMethods } = useTeacherForm(id, toggleOpen)
    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data, isLoading } = useGetTeacherDetail(Number(id))

    const {
        classOptions,
        classSearchText,
        isLoadingClassOptions,
        loadMoreClassOptions,
        setClassSearchText,
    } = useClassOptions()

    useEffect(() => {
        if (id && data && isOpen) {
            reset({
                data: {
                    ...data.data?.attributes,
                    avatar: getPreviewUrl(data.data?.attributes?.avatar),
                    dateOfBirth: data.data?.attributes?.dateOfBirth
                        ? dayjs(data.data.attributes.dateOfBirth)
                        : undefined,
                    classes: data.data?.attributes?.classes?.data?.map(
                        (classInfo) => classInfo.id,
                    ),
                },
            })
        } else {
            reset({})
        }
    }, [data, id, reset, isOpen])

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => {
                toggleOpen()
            }}
            maskClosable
            closable
            okText={id ? 'Lưu thay đổi' : 'Thêm mới'}
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
                disabled: Boolean(!isDirty && id),
            }}
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {id
                        ? 'Cập nhật thông tin giảng viên'
                        : 'Thêm giảng viên mới'}
                </p>
            }
            width={1200}
            classNames={{
                header: 'text-2xl',
                body: 'grid grid-cols-4 gap-4',
            }}
            loading={Boolean(isLoading && id)}
        >
            <FormProvider {...formMethods}>
                <FormSingleUpload label="Avatar" name="data.avatar" isCircle />
                <div className="col-span-3 grid grid-cols-2 gap-4">
                    <FormSelect
                        showSearch
                        label="Lớp"
                        mode="multiple"
                        name="data.classes"
                        loading={isLoadingClassOptions}
                        placeholder="- Chọn lớp học giảng dạy -"
                        options={classOptions}
                        searchValue={classSearchText}
                        onSearch={setClassSearchText}
                        onPopupScroll={loadMoreClassOptions}
                    />
                    <FormInput
                        required
                        label="Họ và tên"
                        name="data.fullName"
                        placeholder="Nhập họ và tên"
                    />
                    {id && (
                        <FormInput
                            required
                            disabled
                            label="Email"
                            name="data.email"
                            type="email"
                            placeholder="example@gmail.com"
                        />
                    )}
                    <FormInput
                        label="Số điện thoại"
                        name="data.phoneNumber"
                        placeholder="Nhập số điện thoại"
                    />
                    <FormSelect
                        label="Giới tính"
                        name="data.gender"
                        options={GENDER_OPTIONS}
                        placeholder="- Chọn giới tính -"
                    />
                    <FormDatePicker
                        label="Ngày sinh"
                        name="data.dateOfBirth"
                        placeholder="- Chọn ngày sinh -"
                    />
                    <FormTextArea
                        label="Địa chỉ"
                        name="data.address"
                        placeholder="Thêm địa chỉ nhà cho giảng viên này..."
                    />
                    <FormTextArea
                        label="Ghi chú"
                        name="data.note"
                        placeholder="Thêm ghi chú cho giảng viên này..."
                    />
                </div>
            </FormProvider>
        </Modal>
    )
}
