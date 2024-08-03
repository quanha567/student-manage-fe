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
import { SyllabusModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetSyllabuses } from '@/queries'
import { subjectService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { SyllabusFormModal } from './components'

const columns: CustomTableColumnType<Data<SyllabusModel>> = [
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
        title: 'Tên đề cương',
        dataIndex: 'attributes',
        key: 'name',
        render: ({ name }: SyllabusModel) => name,
        sorter: true,
        display: true,
    },

    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: SyllabusModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: SyllabusModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const SyllabusPage = () => {
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

    const { data, isLoading, isPlaceholderData, isFetching } = useGetSyllabuses(
        {
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            asc: String(asc),
            searchText: String(searchText),
            sortBy: String(sortBy),
        },
    )

    const handleDeleteSyllabus = useCallback(
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
                console.log('Syllabus delete', err)
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
                pageName="Danh sách đề cương"
                items={[
                    {
                        title: 'Danh sách đề cương',
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
                tableName="đề cương"
                isPagination
                totalElement={data?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: 'Tìm kiếm tên đề cương...',
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: true,
                        onClick: (record: Data<SyllabusModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: true,
                    },
                }}
                onDelete={handleDeleteSyllabus}
            />
            <SyllabusFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
            />
        </div>
    )
}

export default SyllabusPage
