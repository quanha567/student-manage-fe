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
import { SubjectModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetSubjects } from '@/queries'
import { subjectService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { SubjectFormModal } from './components'

const columns: CustomTableColumnType<Data<SubjectModel>> = [
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
        title: 'Mã môn học',
        dataIndex: 'attributes',
        key: 'code',
        render: ({ code }: SubjectModel) => code,
        sorter: true,
        display: true,
    },
    {
        title: 'Tên môn học',
        dataIndex: 'attributes',
        key: 'name',
        render: ({ name }: SubjectModel) => name,
        sorter: true,
        display: true,
    },

    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: SubjectModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: SubjectModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const SubjectPage = () => {
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
        isLoading: isLoadingSubjects,
        isPlaceholderData: isPlaceholderSubjects,
        refetch,
    } = useGetSubjects({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteSubject = useCallback(
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
                console.log('Subject delete', err)
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
                pageName="Danh sách môn học"
                items={[
                    {
                        title: 'Danh sách môn học',
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
                loading={isLoadingSubjects || isPlaceholderSubjects}
                tableName="môn học"
                isPagination
                totalElement={data?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: 'Tìm kiếm tên môn học...',
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: true,
                        onClick: (record: Data<SubjectModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: true,
                    },
                }}
                onDelete={handleDeleteSubject}
            />
            <SubjectFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
                onRefetch={refetch}
            />
        </div>
    )
}

export default SubjectPage
