import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import dayjs from 'dayjs'

import { Modal } from 'antd'

import { FormDatePicker, FormInput, FormSelect } from '@/components'
import { DATE_TIME_FORMAT, EXAM_TYPE_OPTIONS } from '@/constants'
import { useCourseOptions, useGetExamDetail } from '@/queries'
import { DisclosureType } from '@/types'

import { useExamForm } from './useExamForm'

type ExamFormModalProps = DisclosureType

export const ExamFormModal = ({
    isOpen,
    toggleOpen,
    id,
}: ExamFormModalProps) => {
    const { createOrUpdate, formMethods } = useExamForm(id, toggleOpen)

    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data, isLoading } = useGetExamDetail(Number(id))

    const {
        courseOptions,
        courseSearchText,
        isLoadingCourseOptions,
        loadMoreCourseOptions,
        setCourseSearchText,
    } = useCourseOptions()

    useEffect(() => {
        if (id && data && isOpen) {
            reset({
                data: {
                    ...data.data?.attributes,
                    examDate: data.data?.attributes?.examDate
                        ? dayjs(
                              data.data.attributes.examDate,
                              DATE_TIME_FORMAT.DATE_TIME_WITH_TIMEZONE,
                          )
                        : undefined,
                    course: data.data?.attributes?.course?.data?.id,
                },
            })
        } else
            reset({
                data: {
                    examName: '',
                },
            })
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
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {id
                        ? 'Cập nhật thông tin bài kiểm tra, bài thi'
                        : 'Thêm bài kiểm tra, bài thi mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
                body: 'grid gap-4',
            }}
            loading={Boolean(isLoading && id)}
        >
            <FormProvider {...formMethods}>
                <div className="col-span-2 space-y-4">
                    <FormInput
                        required
                        label="Tên bài kiểm tra, bài thi"
                        name="data.examName"
                        placeholder="Nhập tên bài kiểm tra, bài thi"
                    />
                    <FormDatePicker
                        required
                        showTime
                        minuteStep={15}
                        showSecond={false}
                        needConfirm={false}
                        label="Thời gian bắt đầu"
                        name="data.examDate"
                        placeholder="- Chọn thời gian bắt đầu -"
                        format={DATE_TIME_FORMAT.SHORT_DATE_TIME}
                    />
                    <FormSelect
                        required
                        allowClear
                        label="Loại bài kiểm tra, bài thi"
                        name="data.type"
                        options={EXAM_TYPE_OPTIONS}
                        placeholder="- Chọn loại bài kiểm tra, bài thi -"
                    />
                    <FormSelect
                        required
                        allowClear
                        showSearch
                        label="Môn học"
                        name="data.course"
                        options={courseOptions}
                        searchValue={courseSearchText}
                        onSearch={setCourseSearchText}
                        loading={isLoadingCourseOptions}
                        placeholder="- Chọn môn học -"
                        onPopupScroll={loadMoreCourseOptions}
                    />
                </div>
            </FormProvider>
        </Modal>
    )
}
