import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import { Modal } from 'antd'

import { FormInput, FormSelect } from '@/components'
import { useGetAcademicYearDetail, useSemesterOptions } from '@/queries'
import { DisclosureType } from '@/types'

import { useAcademicYearForm } from './useAcademicYearForm'

type AcademicYearFormModalProps = DisclosureType & {
    onRefetch: () => Promise<any>
}

export const AcademicYearFormModal = ({
    isOpen,
    toggleOpen,
    id: id,
    onRefetch,
}: AcademicYearFormModalProps) => {
    const { createOrUpdate, formMethods } = useAcademicYearForm(
        id,
        toggleOpen,
        onRefetch,
    )

    const {
        isLoadingSemesterOptions,
        loadMoreSemesterOptions,
        semesterOptions,
        semesterSearchText,
        setSemesterSearchText,
    } = useSemesterOptions()

    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data: academicYearDetail, isLoading: isLoadingAcademicYear } =
        useGetAcademicYearDetail(Number(id))

    useEffect(() => {
        if (isOpen && id && academicYearDetail) {
            reset({
                data: {
                    ...academicYearDetail.data?.attributes,
                    semesters:
                        academicYearDetail.data?.attributes?.semesters?.data?.map(
                            (item) => item.id,
                        ) ?? [],
                },
            })
        } else {
            reset({
                data: { name: '' },
            })
        }
    }, [academicYearDetail, isOpen, id])

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => {
                toggleOpen('')
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
                    {id ? 'Cập nhật thông tin niên khóa' : 'Thêm niên khóa mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
                body: 'space-y-4',
            }}
            loading={Boolean(isLoadingAcademicYear && id)}
        >
            <FormProvider {...formMethods}>
                <FormInput
                    required
                    label="Tên niên khóa"
                    name="data.name"
                    placeholder="Nhập tên niên khóa"
                />
                <FormSelect
                    mode="multiple"
                    maxTagCount="responsive"
                    label="Danh sách học kỳ"
                    name="data.semesters"
                    placeholder="- Chọn danh sách học kỳ -"
                    loading={isLoadingSemesterOptions}
                    options={semesterOptions}
                    onPopupScroll={loadMoreSemesterOptions}
                    searchValue={semesterSearchText}
                    onSearch={setSemesterSearchText}
                />
            </FormProvider>
        </Modal>
    )
}
