import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useQuery } from '@tanstack/react-query'

import { App, Button, Card, Empty, Select, Table } from 'antd'

import { Breadcrumb, FormInputNumber } from '@/components'
import FormField from '@/components/Forms/FormField'
import { QUERY_KEYS } from '@/constants'
import { useAppSelector, useRole } from '@/hooks'
import { SectionPointResponse } from '@/models'
import { useGetCourses } from '@/queries'
import { selectCurrentUser } from '@/redux'
import { sectionService } from '@/services'

const ManageStudentPointPage = () => {
    const [selectedSection, setSelectedSection] = useState<number>()

    const { notification } = App.useApp()

    const user = useAppSelector(selectCurrentUser)

    const formMethods = useForm()

    const {
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = formMethods

    const { isAdminRole } = useRole()

    const { data } = useGetCourses({
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'name',
    })
    console.log('ManageStudentPointPage  data:', data)

    const {
        data: sectionDetail,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [QUERY_KEYS.SECTION_DETAIL, selectedSection],
        queryFn: async () => {
            if (!selectedSection) return null
            const response =
                await sectionService.getSectionDetail(selectedSection)
            reset({ ...response })

            return response
        },
        enabled: Boolean(selectedSection),
    })

    const courseOptions = useMemo(() => {
        if (isAdminRole) {
            return data?.data?.map((course) => ({
                title: course.attributes?.name,
                label: course.attributes?.name,
                options: course.attributes?.sections?.data?.map((section) => ({
                    label: `${course.attributes?.name ?? ''} - (Mã lớp ${section.attributes?.code ?? ''})`,
                    value: section.id,
                })),
            }))
        } else {
            const options = data?.data
                ?.flatMap((course) => course.attributes?.sections ?? [])
                .flatMap((section) => section.data)
                .filter(
                    (section) =>
                        section?.attributes?.teacher?.data?.id ===
                        user.teacher?.id,
                )
                .map((section) => ({
                    label: `${section?.attributes?.course?.data?.attributes?.name ?? ''} - (Mã lớp ${section?.attributes?.code ?? ''})`,
                    value: section?.id,
                }))

            return options
        }
    }, [data, isAdminRole, user.id])

    const tableColumns = useMemo(() => {
        if (
            Array.isArray(sectionDetail?.exams) &&
            sectionDetail.exams.length > 0 &&
            selectedSection
        ) {
            let columns: unknown[] = []

            columns = sectionDetail.exams.map((exam) => ({
                title: exam.examName,
                id: exam.id,
            }))
            columns = [
                {
                    title: 'STT',
                    render: (_id: unknown, _record: unknown, index: number) =>
                        index + 1,
                    width: 100,
                    align: 'center',
                },
                {
                    title: 'Họ và tên',
                    dataIndex: 'fullName',
                },
                ...columns.map((column) => ({
                    ...column,
                    dataIndex: String(column.id),
                    render: (_id: unknown, _record: unknown, index: number) => (
                        <FormInputNumber
                            size="small"
                            name={`data.${index}.${index}-${column?.id}`}
                            min={0}
                            max={10}
                            placeholder="Nhập điểm số"
                        />
                    ),
                })),
            ]

            return columns
        }

        return []
    }, [sectionDetail, selectedSection])

    const handleSubmitData = async (data: SectionPointResponse) => {
        console.log('handleSubmitData  data:', JSON.stringify(data, null, 2))
        if (!selectedSection) return

        try {
            await sectionService.importScore(data, selectedSection)
            await refetch()
            notification.success({
                message: 'Lưu kết quả điểm sinh viên thành công!',
            })
        } catch (err) {
            console.log('handleSubmitData  err:', err)
            notification.error({
                message: 'Có lỗi xảy ra vui lòng thử lại sau!',
            })
        }
    }

    return (
        <>
            <Breadcrumb
                pageName="Quản lý điểm sinh viên"
                items={[
                    {
                        title: 'Quản lý điểm sinh viên',
                    },
                ]}
            />
            <Card loading={isSubmitting}>
                <div className="mb-4 grid gap-4 lg:grid-cols-2">
                    <FormField
                        label="Lớp học"
                        renderField={() => (
                            <Select
                                allowClear
                                className="w-full"
                                placeholder="Chọn lớp học..."
                                options={courseOptions}
                                value={selectedSection}
                                onChange={setSelectedSection}
                            />
                        )}
                    />
                </div>
                <FormProvider {...formMethods}>
                    <Table
                        bordered
                        rowKey="id"
                        loading={isLoading}
                        columns={tableColumns}
                        scroll={{
                            y: 1000,
                        }}
                        dataSource={
                            selectedSection ? (sectionDetail?.data ?? []) : []
                        }
                        locale={{
                            emptyText: (
                                <Empty description="Chọn một lớp để nhập điểm" />
                            ),
                        }}
                        size="small"
                        pagination={false}
                    />
                </FormProvider>
                <div className="mt-4 flex justify-end">
                    <Button
                        type="primary"
                        disabled={
                            !(
                                Array.isArray(sectionDetail?.data) &&
                                sectionDetail.data.length > 0
                            ) || !isDirty
                        }
                        onClick={handleSubmit(handleSubmitData)}
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </Card>
        </>
    )
}

export default ManageStudentPointPage
