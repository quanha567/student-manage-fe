import { useCallback } from 'react'

import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { useDisclosure, useSearch } from '@/hooks'
import { SemesterModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetSemesters } from '@/queries'
import { semesterService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { SemesterFormModal } from './components'

const columns: CustomTableColumnType<Data<SemesterModel>> = [
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
        title: 'Tên học kỳ',
        dataIndex: 'attributes',
        key: 'code',
        render: ({ name }: SemesterModel) => name,
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian',
        dataIndex: 'attributes',
        key: 'startDate',
        render: ({ startDate, endDate }: SemesterModel) => (
            <span>
                {formatDateTime(String(startDate), DATE_TIME_FORMAT.DATE_ONLY)}{' '}
                - {formatDateTime(String(endDate), DATE_TIME_FORMAT.DATE_ONLY)}
            </span>
        ),
        sorter: true,
        display: true,
    },

    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: SemesterModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: SemesterModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const SemesterPage = () => {
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

    const {
        data,
        isLoading: isLoadingSemesters,
        isPlaceholderData: isPlaceholderSemesters,
    } = useGetSemesters({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteSemester = useCallback(
        async (deleteIds: number[]) => {
            try {
                const dataDeleted = await Promise.all(
                    deleteIds.map((id) => semesterService.delete(id)),
                )
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.SUBJECT_LIST],
                })
                notification.success({
                    message: `Đã xóa thành công ${String(dataDeleted.length)} dòng dữ liệu!`,
                })
            } catch (err: unknown) {
                console.log('Semester delete', err)
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
                pageName="Danh sách học kỳ"
                items={[
                    {
                        title: 'Danh sách học kỳ',
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
                loading={isLoadingSemesters || isPlaceholderSemesters}
                tableName="học kỳ"
                isPagination
                totalElement={data?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: 'Tìm kiếm tên học kỳ...',
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: true,
                        onClick: (record: Data<SemesterModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: true,
                    },
                }}
                onDelete={handleDeleteSemester}
            />
            <SemesterFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
            />
        </div>
    )
}

export default SemesterPage
