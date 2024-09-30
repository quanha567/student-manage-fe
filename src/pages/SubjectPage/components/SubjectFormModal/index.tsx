import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'

import { Modal } from 'antd'

import { FormInput, FormSelect, FormTextArea } from '@/components'
import { useGetSubjectDetail, useSyllabusOptions } from '@/queries'
import { DisclosureType } from '@/types'

import { useSubjectForm } from './useSubjectForm'

type SubjectFormModalProps = DisclosureType

export const SubjectFormModal = ({
    isOpen,
    toggleOpen,
    id,
}: SubjectFormModalProps) => {
    const { createOrUpdate, formMethods } = useSubjectForm(id, toggleOpen)

    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data, isLoading } = useGetSubjectDetail(Number(id))

    const {
        isLoadingSyllabusOptions,
        loadMoreSyllabusOptions,
        setSyllabusSearchText,
        syllabusOptions,
        syllabusSearchText,
    } = useSyllabusOptions()

    useEffect(() => {
        if (id && data && isOpen) {
            const syllabusIds = data.data?.attributes?.syllabuses?.data?.map(
                (syllabus) => syllabus.id,
            )
            reset({
                data: {
                    ...data.data?.attributes,
                    syllabuses: syllabusIds,
                },
            })
        } else
            reset({
                data: {
                    description: '',
                    name: '',
                    syllabuses: [],
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
                    {id ? 'Cập nhật thông tin môn học' : 'Thêm môn học mới'}
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
                        label="Tên môn học"
                        name="data.name"
                        placeholder="Nhập tên môn học"
                    />
                    <FormTextArea
                        rows={4}
                        label="Mô tả"
                        name="data.description"
                        placeholder="Nhập mô tả môn học"
                    />
                    <FormSelect
                        allowClear
                        showSearch
                        mode="multiple"
                        label="Đề cương"
                        name="data.syllabuses"
                        maxTagCount="responsive"
                        options={syllabusOptions}
                        searchValue={syllabusSearchText}
                        onSearch={setSyllabusSearchText}
                        loading={isLoadingSyllabusOptions}
                        placeholder="- Chọn đề cương môn học -"
                        onPopupScroll={loadMoreSyllabusOptions}
                    />
                </div>
            </FormProvider>
        </Modal>
    )
}
