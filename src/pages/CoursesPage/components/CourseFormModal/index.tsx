import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import dayjs from 'dayjs'

import { Modal } from 'antd'

import {
    FormDatePicker,
    FormInput,
    FormInputNumber,
    FormSelect,
    FormTextArea,
} from '@/components'
import { COURSE_TYPE_OPTIONS } from '@/constants'
import { useGetCourseDetail, useSubjectOptions } from '@/queries'
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

    const {
        isLoadingSubjectOptions,
        loadMoreSubjectOptions,
        setSubjectSearchText,
        subjectOptions,
        subjectSearchText,
    } = useSubjectOptions()

    useEffect(() => {
        if (id && data && isOpen) {
            reset({
                data: {
                    ...data.data?.attributes,
                    startDate: data.data?.attributes?.startDate
                        ? dayjs(data.data.attributes.startDate)
                        : undefined,
                    endDate: data.data?.attributes?.endDate
                        ? dayjs(data.data.attributes.endDate)
                        : undefined,
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
                    {id ? 'Cập nhật thông tin học phần' : 'Thêm học phần mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
            }}
            loading={Boolean(isLoading && id)}
        >
            <FormProvider {...formMethods}>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        required
                        label="Tên học phần"
                        name="data.name"
                        placeholder="Nhập tên học phần"
                    />
                    <FormSelect
                        required
                        name="data.subject"
                        label="Môn học"
                        placeholder="- Chọn môn học -"
                        loading={isLoadingSubjectOptions}
                        options={subjectOptions}
                        searchValue={subjectSearchText}
                        onSearch={setSubjectSearchText}
                        onPopupScroll={loadMoreSubjectOptions}
                    />
                    <FormInputNumber
                        required
                        label="Số tín chỉ"
                        name="data.credits"
                        placeholder="Nhập số tín chỉ"
                    />
                    <FormInputNumber
                        required
                        label="Số tiết lý thuyết"
                        name="data.lectureHours"
                        placeholder="Nhập số tín chỉ"
                    />
                    <FormInputNumber
                        required
                        label="Số tiết thực hành"
                        name="data.labHours"
                        placeholder="Nhập số tín chỉ"
                    />
                    <FormSelect
                        required
                        label="Loại học phần"
                        name="data.courseType"
                        options={COURSE_TYPE_OPTIONS}
                        placeholder="- Chọn loại học phần -"
                    />
                    <FormInput
                        required
                        label="Học kỳ"
                        name="data.semester"
                        placeholder="Nhập tên học kỳ"
                    />
                    <FormDatePicker
                        required
                        label="Ngày bắt đầu"
                        name="data.startDate"
                        placeholder="- Chọn ngày bắt đầu -"
                    />
                    <FormDatePicker
                        label="Ngày kết thúc"
                        name="data.endDate"
                        placeholder="- Chọn ngày kết thúc -"
                    />
                    <div className="col-span-2">
                        <FormTextArea
                            allowClear
                            rows={4}
                            label="Mô tả"
                            name="data.description"
                            placeholder="Nhập mô tả học phần"
                        />
                    </div>
                </div>
            </FormProvider>
        </Modal>
    )
}
