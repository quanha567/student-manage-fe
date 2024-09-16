import { Key, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Badge, Card, Select, Table, Tag } from 'antd'
import { ColumnType } from 'antd/es/table'

import { Breadcrumb } from '@/components'
import { QUERY_KEYS } from '@/constants'
import { CourseModel, CourseType } from '@/models'
import { useSemesterOptions } from '@/queries'
import { courseService } from '@/services'
import { Data } from '@/types'

import { CourseDetailCard, CourseRegisteredCard } from './components'

const courseColumns: ColumnType<Data<CourseModel>>[] = [
    {
        title: 'STT',
        key: 'id',
        align: 'center',
        width: 90,
        render: (_row, _record, index: number) => index + 1,
    },
    {
        title: 'Mã học phần',
        key: 'code',
        dataIndex: 'attributes',
        render: ({ code }: CourseModel) => code,
    },
    {
        title: 'Môn học',
        key: 'name',
        dataIndex: 'attributes',
        render: ({ name }: CourseModel) => name,
    },
    {
        title: 'Tín chỉ',
        key: 'credits',
        align: 'center',
        dataIndex: 'attributes',
        render: ({ credits }: CourseModel) => credits,
    },
    {
        title: 'Lớp dự kiến',
        key: 'credits',
        align: 'center',
        dataIndex: 'attributes',
        render: ({ classes }: CourseModel) => (
            <div className="flex flex-wrap gap-1">
                {classes?.data?.map((classInfo) => (
                    <Tag className="m-0" key={classInfo.id}>
                        {classInfo.attributes?.className}
                    </Tag>
                ))}
            </div>
        ),
    },
    {
        title: 'Loại',
        key: 'credits',
        align: 'center',
        dataIndex: 'attributes',
        width: 100,
        render: ({ courseType }: CourseModel) =>
            courseType ? (
                <Badge
                    status={
                        courseType === CourseType.REQUIRED ? 'error' : 'success'
                    }
                    text={
                        courseType === CourseType.REQUIRED
                            ? 'Bắt buộc'
                            : 'Lựa chọn'
                    }
                />
            ) : (
                '---'
            ),
    },
]

const RegisterCoursePage = () => {
    const [courseSelectedIds, setCourseSelectedIds] = useState<Key[]>()

    const { data: courses, isLoading: isLoadingCourses } = useQuery({
        queryKey: [QUERY_KEYS.COURSE_LIST],
        queryFn: async () =>
            await courseService.search({
                populate: 'deep',
            }),
    })

    const {
        isLoadingSemesterOptions,
        loadMoreSemesterOptions,
        semesterOptions,
        semesterSearchText,
        setSemesterSearchText,
    } = useSemesterOptions()

    const courseSelected = useMemo(() => {
        if (Array.isArray(courseSelectedIds) && courseSelectedIds.length > 0) {
            return courses?.data?.find(
                (course) => course.id === courseSelectedIds[0],
            )
        }

        return null
    }, [courseSelectedIds, courses])

    return (
        <div>
            <Breadcrumb
                pageName="Đăng ký học phần"
                items={[
                    {
                        title: 'Đăng ký học phần',
                    },
                ]}
            />
            <div className="mb-4 grid grid-cols-3 gap-4">
                <Card className="col-span-2">
                    <div className="space-y-4">
                        <p className="text-lg font-bold">Thông tin chi tiết</p>
                        <Select
                            className="w-full"
                            placeholder="Chọn đợt đăng ký"
                            options={semesterOptions}
                            onPopupScroll={loadMoreSemesterOptions}
                            searchValue={semesterSearchText}
                            onSearch={setSemesterSearchText}
                            loading={isLoadingSemesterOptions}
                        />
                        <Table
                            rowKey="id"
                            size="small"
                            bordered
                            loading={isLoadingCourses}
                            columns={courseColumns}
                            dataSource={courses?.data}
                            pagination={false}
                            rowSelection={{
                                type: 'radio',
                                selectedRowKeys: courseSelectedIds,
                                onChange: setCourseSelectedIds,
                            }}
                        />
                    </div>
                </Card>
                <CourseDetailCard {...courseSelected?.attributes} />
            </div>
            <CourseRegisteredCard />
        </div>
    )
}

export default RegisterCoursePage
