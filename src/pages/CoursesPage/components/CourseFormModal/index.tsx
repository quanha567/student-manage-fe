import { useEffect } from 'react'
import { FormProvider, useFieldArray } from 'react-hook-form'

import { DeleteFilled } from '@ant-design/icons'
import dayjs from 'dayjs'

import { Button, Modal, Table, TableColumnsType } from 'antd'
import { DefaultOptionType } from 'antd/es/cascader'

import {
    FormDatePicker,
    FormInput,
    FormInputNumber,
    FormSelect,
    FormTextArea,
} from '@/components'
import FormField from '@/components/Forms/FormField'
import { COURSE_TYPE_OPTIONS } from '@/constants'
import { SectionModel } from '@/models'
import {
    useClassOptions,
    useGetCourseDetail,
    useSubjectOptions,
} from '@/queries'
import { DisclosureType } from '@/types'

import { useCourseForm } from './useCourseForm'

type CourseFormModalProps = DisclosureType

const dayOptions: DefaultOptionType[] = [
    {
        label: 'Thứ 2',
        value: 'Monday',
    },
    {
        label: 'Thứ 3',
        value: 'Tuesday',
    },
    {
        label: 'Thứ 4',
        value: 'Wednesday',
    },
    {
        label: 'Thứ 5',
        value: 'Thursday',
    },
    {
        label: 'Thứ 6',
        value: 'Friday',
    },
    {
        label: 'Thứ 7',
        value: 'Saturday',
    },
    {
        label: 'Chủ nhật',
        value: 'Sunday',
    },
]

export const CourseFormModal = ({
    isOpen,
    toggleOpen,
    id,
}: CourseFormModalProps) => {
    const {
        createOrUpdate,
        formMethods,
        appendNewSection,
        removeSection,
        sectionList,
        appendNewSectionSchedule,
        removeSectionSchedule,
    } = useCourseForm(id, toggleOpen)

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
                    startDate: data.data?.attributes?.startDate
                        ? dayjs(data.data.attributes.startDate)
                        : undefined,
                    endDate: data.data?.attributes?.endDate
                        ? dayjs(data.data.attributes.endDate)
                        : undefined,
                    classes:
                        data.data?.attributes?.classes?.data
                            ?.map((classInfo) => classInfo.id)
                            .filter(Boolean) ?? [],
                    subject: data.data?.attributes?.subject?.data?.id,
                    sections: data.data?.attributes?.sections?.data?.map(
                        (section) => ({
                            ...section.attributes,
                            id: section.id,
                        }),
                    ),
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

    const GetScheduleFieldArray = (sectionIndex: number) =>
        useFieldArray({
            control: formMethods.control,
            name: `data.sections[${String(sectionIndex)}].schedules`,
        })

    const classListColumn: TableColumnsType<SectionModel> = [
        {
            title: 'STT',
            render: (_row, _record, index: number) => index + 1,
            width: 50,
            align: 'center',
        },

        {
            title: 'Số lượng sinh viên',
            render: (_row, _record, index: number) => (
                <FormInputNumber
                    size="small"
                    className="py-1"
                    name={`data.sections.${String(index)}.capacity`}
                />
            ),
        },
        {
            title: 'Thời gian',
            render: (_row, _record, index: number) => {
                const { append, remove, fields } = GetScheduleFieldArray(index)

                return (
                    <div>
                        {fields.map((schedule, rowIndex) => (
                            <div
                                key={schedule.id}
                                className="grid grid-cols-3 gap-1"
                            >
                                <FormSelect
                                    size="small"
                                    className="py-1"
                                    options={dayOptions}
                                    name={`data.sections[${String(index)}].schedules.${String(rowIndex)}.day`}
                                />
                            </div>
                        ))}
                        <Button
                            onClick={() => append({})}
                            size="small"
                            className="ml-auto"
                        >
                            Thêm thời gian học
                        </Button>
                    </div>
                )
            },
        },
        {
            title: <DeleteFilled />,
            render: (_row, _record, index) => (
                <Button
                    danger
                    size="small"
                    onClick={() => removeSection(index)}
                >
                    Xóa
                </Button>
            ),
            align: 'center',
        },
    ]

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
            className="!w-full xl:max-w-[75%]"
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {id ? 'Cập nhật thông tin học phần' : 'Thêm học phần mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
                body: 'max-h-[80vh]  overflow-x-hidden overflow-y-auto',
            }}
            loading={Boolean(isLoading && id)}
        >
            <FormProvider {...formMethods}>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <FormInput
                            required
                            label="Tên học phần"
                            name="data.name"
                            placeholder="Nhập tên học phần"
                        />
                        <FormSelect
                            showSearch
                            required
                            mode="multiple"
                            name="data.classes"
                            label="Danh sách lớp đăng ký"
                            placeholder="- Chọn danh sách lớp -"
                            loading={isLoadingClassOptions}
                            options={classOptions}
                            searchValue={classSearchText}
                            onSearch={setClassSearchText}
                            onPopupScroll={loadMoreClassOptions}
                        />
                        <FormSelect
                            showSearch
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
                        <FormSelect
                            required
                            label="Loại học phần"
                            name="data.courseType"
                            options={COURSE_TYPE_OPTIONS}
                            placeholder="- Chọn loại học phần -"
                        />
                        <div className="col-span-2">
                            <FormTextArea
                                allowClear
                                label="Mô tả"
                                name="data.description"
                                placeholder="Nhập mô tả học phần"
                            />
                        </div>
                    </div>
                    <FormField
                        label="Danh sách lớp"
                        renderField={() => (
                            <Table
                                bordered
                                size="small"
                                footer={() => (
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={() => appendNewSection({})}
                                        className="bg-sky-500 hover:!bg-sky-600"
                                    >
                                        Thêm mới
                                    </Button>
                                )}
                                dataSource={sectionList}
                                columns={classListColumn}
                                pagination={false}
                            />
                        )}
                    />
                </div>
            </FormProvider>
        </Modal>
    )
}
