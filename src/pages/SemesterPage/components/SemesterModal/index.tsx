import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import dayjs from 'dayjs'

import { Modal } from 'antd'

import { FormDatePicker, FormInput, FormSelect } from '@/components'
import { DATE_TIME_FORMAT } from '@/constants'
import {
    useClassOptions,
    useCourseOptions,
    useGetSemesterDetail,
} from '@/queries'
import { DisclosureType } from '@/types'

import { useSemesterForm } from './useSemesterForm'

type SemesterFormModalProps = DisclosureType

export const SemesterFormModal = ({
    isOpen,
    toggleOpen,
    id,
}: SemesterFormModalProps) => {
    const { createOrUpdate, formMethods } = useSemesterForm(id, toggleOpen)

    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data, isLoading } = useGetSemesterDetail(Number(id))

    const {
        classOptions,
        classSearchText,
        isLoadingClassOptions,
        loadMoreClassOptions,
        setClassSearchText,
    } = useClassOptions()

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
                    startDate: data.data?.attributes?.startDate
                        ? dayjs(
                              data.data.attributes.startDate,
                              DATE_TIME_FORMAT.DATE_ONLY_REVERSE_HYPHEN,
                          )
                        : undefined,
                    endDate: data.data?.attributes?.endDate
                        ? dayjs(
                              data.data.attributes.endDate,
                              DATE_TIME_FORMAT.DATE_ONLY_REVERSE_HYPHEN,
                          )
                        : undefined,
                    classes:
                        data.data?.attributes?.classes?.data?.map(
                            (classInfo) => classInfo.id,
                        ) ?? [],
                    courses:
                        data.data?.attributes?.courses?.data?.map(
                            (course) => course.id,
                        ) ?? [],
                },
            })
        } else
            reset({
                data: {
                    name: '',
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
                    {id ? 'Cập nhật thông tin học kỳ' : 'Thêm học kỳ mới'}
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
                        label="Tên học kỳ"
                        name="data.name"
                        placeholder="Nhập tên học kỳ"
                    />
                    <FormDatePicker
                        required
                        label="Thời gian bắt đầu"
                        name="data.startDate"
                        placeholder="- Chọn thời gian bắt đầu -"
                    />
                    <FormDatePicker
                        required
                        label="Thời gian kết thúc"
                        name="data.endDate"
                        placeholder="- Chọn thời gian kết thúc -"
                    />
                    <FormSelect
                        allowClear
                        showSearch
                        mode="multiple"
                        label="Môn học"
                        name="data.courses"
                        maxTagCount="responsive"
                        options={courseOptions}
                        searchValue={courseSearchText}
                        onSearch={setCourseSearchText}
                        loading={isLoadingCourseOptions}
                        placeholder="- Chọn môn học -"
                        onPopupScroll={loadMoreCourseOptions}
                    />
                    <FormSelect
                        allowClear
                        showSearch
                        mode="multiple"
                        label="Lớp học"
                        name="data.classes"
                        maxTagCount="responsive"
                        options={classOptions}
                        searchValue={classSearchText}
                        onSearch={setClassSearchText}
                        loading={isLoadingClassOptions}
                        placeholder="- Chọn lớp học -"
                        onPopupScroll={loadMoreClassOptions}
                    />
                </div>
            </FormProvider>
        </Modal>
    )
}
