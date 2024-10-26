import { useEffect } from 'react'
import { Control, FormProvider, useFieldArray } from 'react-hook-form'

import { DeleteFilled } from '@ant-design/icons'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { Button, Modal, Table, TableColumnsType } from 'antd'
import { DefaultOptionType } from 'antd/es/cascader'

import {
    FormDatePicker,
    FormInput,
    FormInputNumber,
    FormSelect,
    FormTextArea,
    FormTimePicker,
} from '@/components'
import FormField from '@/components/Forms/FormField'
import { COURSE_TYPE_OPTIONS, DATE_TIME_FORMAT } from '@/constants'
import { SectionModel, SectionSchedule } from '@/models'
import {
    useClassOptions,
    useExamOptions,
    useGetCourseDetail,
    useSemesterOptions,
    useSubjectOptions,
    useTeacherOptions,
} from '@/queries'
import { CourseCreateRequest, CourseListResponse } from '@/services'
import { DisclosureType } from '@/types'

import { useCourseForm } from './useCourseForm'

type CourseFormModalProps = DisclosureType & {
    onRefetch: (
        options?: RefetchOptions,
    ) => Promise<QueryObserverResult<CourseListResponse>>
}

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
    onRefetch,
}: CourseFormModalProps) => {
    const {
        createOrUpdate,
        formMethods,
        appendNewSection,
        removeSection,
        sectionList,
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
        isLoadingSemesterOptions,
        loadMoreSemesterOptions,
        semesterOptions,
        semesterSearchText,
        setSemesterSearchText,
    } = useSemesterOptions()

    const {
        classOptions,
        classSearchText,
        isLoadingClassOptions,
        loadMoreClassOptions,
        setClassSearchText,
    } = useClassOptions()

    const {
        examOptions,
        examSearchText,
        isLoadingExamOptions,
        loadMoreExamOptions,
        setExamSearchText,
    } = useExamOptions()

    const {
        isLoadingTeacherOptions,
        loadMoreTeacherOptions,
        setTeacherSearchText,
        teacherOptions,
        teacherSearchText,
    } = useTeacherOptions()

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
                    exams:
                        data.data?.attributes?.exams?.data
                            ?.map((exam) => exam.id)
                            .filter(Boolean) ?? [],
                    subject: data.data?.attributes?.subject?.data?.id,
                    sections: data.data?.attributes?.sections?.data?.map(
                        (section) => ({
                            ...section.attributes,
                            id: section.id,
                            teacher: section.attributes?.teacher?.data?.id,
                            schedules: section.attributes?.schedules?.map(
                                (schedule) => ({
                                    ...schedule,
                                    startTime: schedule.startTime
                                        ? dayjs(
                                              schedule.startTime,
                                              DATE_TIME_FORMAT.SHORT_TIME,
                                          )
                                        : undefined,
                                    endTime: schedule.endTime
                                        ? dayjs(DATE_TIME_FORMAT.SHORT_TIME)
                                        : undefined,
                                }),
                            ),
                        }),
                    ),
                    semester: data.data?.attributes?.semester?.data?.id,
                },
            })
        } else {
            reset()
        }
    }, [data, id, reset, isOpen])

    const classListColumn: TableColumnsType<SectionModel> = [
        {
            title: 'STT',
            render: (_row, _record, index: number) => index + 1,
            width: 50,
            align: 'center',
        },
        {
            title: 'Số lượng sinh viên / GV',
            width: 200,
            render: (_row, _record, index: number) => (
                <div className="space-y-2">
                    <FormInputNumber
                        size="small"
                        className="py-1"
                        inputMode="numeric"
                        name={`data.sections.${String(index)}.capacity`}
                    />
                    <FormSelect
                        size="small"
                        name={`data.sections.${String(index)}.teacher`}
                        placeholder="Chọn giảng viên..."
                        loading={isLoadingTeacherOptions}
                        options={teacherOptions}
                        onPopupScroll={loadMoreTeacherOptions}
                        searchValue={teacherSearchText}
                        onSearch={setTeacherSearchText}
                    />
                </div>
            ),
        },
        {
            title: (
                <div className="flex">
                    <span className="flex-1">Phòng</span>
                    <span className="flex-1">Thứ</span>
                    <span className="flex-1">Thời gian bắt đầu</span>
                    <span className="flex-1">Thời gian kết thúc</span>
                    <span className="h-1 w-10"></span>
                </div>
            ),
            render: (_row, _record, index: number) => (
                <CourseSchedule control={formMethods.control} index={index} />
            ),
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

                        <FormSelect
                            required
                            showSearch
                            label="Học kỳ"
                            name="data.semester"
                            options={semesterOptions}
                            searchValue={semesterSearchText}
                            onSearch={setSemesterSearchText}
                            loading={isLoadingSemesterOptions}
                            placeholder="- Chọn học kỳ -"
                            onPopupScroll={loadMoreSemesterOptions}
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
                        <FormSelect
                            showSearch
                            mode="multiple"
                            maxTagCount="responsive"
                            label="Bài kiểm tra, bài thi"
                            name="data.exams"
                            options={examOptions}
                            searchValue={examSearchText}
                            onSearch={setExamSearchText}
                            loading={isLoadingExamOptions}
                            placeholder="Nhập tên bài kiểm tra, bài thi"
                            onPopupScroll={loadMoreExamOptions}
                        />
                        <FormTextArea
                            allowClear
                            label="Mô tả"
                            name="data.description"
                            placeholder="Nhập mô tả học phần"
                        />
                    </div>
                    <FormField
                        label="Danh sách lớp"
                        renderField={() => (
                            <Table
                                bordered
                                rowKey="id"
                                size="small"
                                footer={() => (
                                    <div>
                                        {!sectionList.length ? (
                                            <p className="text-red-500">
                                                Vui lòng thêm ít nhất một lớp
                                                học phần!
                                            </p>
                                        ) : (
                                            <></>
                                        )}
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() =>
                                                appendNewSection({
                                                    capacity: 0,
                                                    code: '',
                                                    schedules: [],
                                                })
                                            }
                                            className="bg-sky-500 hover:!bg-sky-600"
                                        >
                                            Thêm mới
                                        </Button>
                                    </div>
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

interface CourseScheduleProps {
    control: Control<CourseCreateRequest>
    index: number
}

const CourseSchedule = ({ control, index }: CourseScheduleProps) => {
    const { append, remove, fields } = useFieldArray({
        control,
        name: `data.sections.${String(index)}.schedules`,
    })

    return (
        <div className="divide-y-[1px]">
            {fields.map((schedule: SectionSchedule, rowIndex) => (
                <div key={schedule.id} className="flex items-start gap-1 py-2">
                    <FormInput
                        size="small"
                        className="py-1"
                        wrapperClassName="flex-1"
                        name={`data.sections.${String(index)}.schedules.${String(rowIndex)}.room`}
                        placeholder="Nhập tên phòng học"
                    />
                    <FormSelect
                        size="small"
                        wrapperClassName="flex-1"
                        className="h-full w-full"
                        style={{
                            height: 34,
                        }}
                        options={dayOptions}
                        name={`data.sections.${String(index)}.schedules.${String(rowIndex)}.day`}
                        placeholder="Chọn thứ trong tuần"
                    />

                    <FormTimePicker
                        variant="filled"
                        wrapperClassName="flex-1"
                        showSecond={false}
                        needConfirm={false}
                        size="small"
                        className="w-full py-1"
                        placeholder="Chọn thời gian bắt đầu"
                        name={`data.sections.${String(index)}.schedules.${String(rowIndex)}.startTime`}
                    />

                    <FormTimePicker
                        wrapperClassName="flex-1"
                        className="w-full py-1"
                        size="small"
                        showSecond={false}
                        needConfirm={false}
                        name={`data.sections.${String(index)}.schedules.${String(rowIndex)}.endTime`}
                        placeholder="Chọn thời gian kết thúc"
                    />
                    <Button
                        danger
                        size="small"
                        onClick={() => remove(rowIndex)}
                    >
                        Xóa
                    </Button>
                </div>
            ))}
            {!fields.length ? (
                <p className="text-red-500">
                    Vui lòng thêm ít nhất một thời gian học cho lớp này!
                </p>
            ) : (
                <></>
            )}
            <Button
                onClick={() =>
                    append(
                        {
                            day: undefined,
                            room: '',
                            startTime: '',
                            endTime: '',
                        },
                        {
                            shouldFocus: false,
                        },
                    )
                }
                size="small"
                className="ml-auto"
            >
                Thêm thời gian học
            </Button>
        </div>
    )
}
