import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
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
import { useClassOptions, useGetStudentDetail } from '@/queries'
import { StudentListResponse } from '@/services'
import { DisclosureType } from '@/types'
import { getPreviewUrl } from '@/utils'

import { useStudentForm } from './useStudentForm'

type ClassFormModalProps = DisclosureType & {
    onRefetch: (
        options?: RefetchOptions,
    ) => Promise<QueryObserverResult<StudentListResponse>>
}

export const ClassFormModal = ({
    isOpen,
    toggleOpen,
    id: studentId,
    onRefetch,
}: ClassFormModalProps) => {
    const { createOrUpdate, formMethods } = useStudentForm(
        studentId,
        toggleOpen,
        onRefetch,
    )
    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data, isLoading } = useGetStudentDetail(Number(studentId))

    const {
        classOptions,
        classSearchText,
        isLoadingClassOptions,
        loadMoreClassOptions,
        setClassSearchText,
    } = useClassOptions()

    useEffect(() => {
        if (studentId && data && isOpen) {
            reset({
                data: {
                    ...data.data?.attributes,
                    avatar: getPreviewUrl(data.data?.attributes?.avatar),
                    classId: data.data?.attributes?.class?.data?.id,
                    dateOfBirth: data.data?.attributes?.dateOfBirth
                        ? dayjs(data.data.attributes.dateOfBirth)
                        : undefined,
                    class: undefined,
                },
            })
        } else {
            reset({})
        }
    }, [data, studentId, reset, isOpen])

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => {
                toggleOpen()
            }}
            maskClosable
            closable
            okText={studentId ? 'Lưu thay đổi' : 'Thêm mới'}
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
                disabled: Boolean(!isDirty && studentId),
            }}
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {studentId
                        ? 'Cập nhật thông tin sinh viên'
                        : 'Thêm sinh viên mới'}
                </p>
            }
            width={1200}
            classNames={{
                header: 'text-2xl',
                body: 'grid grid-cols-4 gap-4',
            }}
            loading={Boolean(isLoading && studentId)}
        >
            <FormProvider {...formMethods}>
                <FormSingleUpload label="Avatar" name="data.avatar" isCircle />
                <div className="col-span-3 grid grid-cols-2 gap-4">
                    <FormSelect
                        required
                        showSearch
                        label="Lớp"
                        name="data.classId"
                        loading={isLoadingClassOptions}
                        placeholder="- Chọn lớp học -"
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
                    {studentId && (
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
                        placeholder="Thêm địa chỉ nhà cho sinh viên này..."
                    />
                    <FormTextArea
                        label="Ghi chú"
                        name="data.note"
                        placeholder="Thêm ghi chú cho sinh viên này..."
                    />
                </div>
            </FormProvider>
        </Modal>
    )
}
