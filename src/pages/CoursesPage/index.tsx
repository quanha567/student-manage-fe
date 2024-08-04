import { useCallback } from 'react'

import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useDisclosure, useSearch } from '@/hooks'
import { CourseModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetCourses } from '@/queries/courseQueries'
import { subjectService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { CourseFormModal } from './components'

const columns: CustomTableColumnType<Data<CourseModel>> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        align: 'center',
        sorter: true,
        display: true,
    },
    {
        title: 'Tên học phần',
        dataIndex: 'attributes',
        key: 'name',
        render: ({ name }: CourseModel) => name,
        sorter: true,
        display: true,
    },

    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: CourseModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: CourseModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const CoursesPage = () => {
    const { isOpen, toggleOpen, id } = useDisclosure()

    const { notification } = App.useApp()

    const [params] = useSearch()
    const {
        pageSize = 10,
        pageIndex = 1,
        sortBy = 'createdAt',
        asc = 'desc',
        searchText = '',
    } = params

    const { data, isLoading, isPlaceholderData, isFetching } = useGetCourses({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteCourse = useCallback(
        async (deleteIds: number[]) => {
            try {
                const dataDeleted = await Promise.all(
                    deleteIds.map((id) => subjectService.delete(id)),
                )
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.SUBJECT_LIST],
                })
                notification.success({
                    message: `Đã xóa thành công ${String(dataDeleted.length)} dòng dữ liệu!`,
                })
            } catch (err: unknown) {
                console.log('Course delete', err)
                notification.error({
                    message: `Có lỗi xảy ra vui lòng thử lại sau!`,
                })
            }
        },
        [notification],
    )

    return (
        <div>
            <Breadcrumb
                pageName="Danh sách học phần"
                items={[
                    {
                        title: 'Danh sách học phần',
                    },
                ]}
                renderRight={
                    <Button
                        onClick={() => toggleOpen()}
                        className="ml-auto flex items-center"
                    >
                        <IoMdAdd />
                        Thêm
                    </Button>
                }
            />

            <CustomTable
                columns={columns}
                dataSource={data?.data}
                loading={isLoading || (isFetching && isPlaceholderData)}
                tableName="học phần"
                isPagination
                totalElement={data?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: 'Tìm kiếm tên học phần...',
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: true,
                        onClick: (record: Data<CourseModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: true,
                    },
                }}
                onDelete={handleDeleteCourse}
            />
            <CourseFormModal id={id} isOpen={isOpen} toggleOpen={toggleOpen} />
        </div>
    )
}

export default CoursesPage
