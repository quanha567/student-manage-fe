import { useCallback } from 'react'

import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { useDisclosure, useSearch } from '@/hooks'
import { ClassModel, DepartmentModel } from '@/models'
import { useGetClasses } from '@/queries'
import { classService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { ClassFormModal } from './components'

const PageName = 'lớp học'

const columns: CustomTableColumnType<Data<ClassModel>> = [
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
        title: `Tên ${PageName}`,
        dataIndex: 'attributes',
        key: 'className',
        render: ({ className }: ClassModel) => className,
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: ClassModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: ClassModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const ClassPage = () => {
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
        data: classs,
        isLoading: isLoadingDepartments,
        isPlaceholderData: isPlaceholderDepartments,
        refetch,
    } = useGetClasses({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteDepartment = useCallback(
        async (deleteIds?: number[]) => {
            if (!deleteIds || deleteIds.length === 0) return

            try {
                await Promise.all(
                    deleteIds.map((id) => classService.delete(id)),
                )
                await await refetch()
                notification.success({
                    message: `Xóa dữ liệu thành công!`,
                })
            } catch (err: unknown) {
                console.log('Department delete', err)
            }
        },
        [notification],
    )

    return (
        <div>
            <Breadcrumb
                pageName={`Danh sách ${PageName}`}
                items={[
                    {
                        title: `Danh sách ${PageName}`,
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
                isPagination
                tableName={PageName}
                columns={columns}
                dataSource={classs?.data}
                loading={isLoadingDepartments || isPlaceholderDepartments}
                totalElement={classs?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: `Tìm kiếm tên ${PageName}...`,
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: true,
                        onClick: (record: Data<DepartmentModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: true,
                    },
                }}
                onDelete={handleDeleteDepartment}
            />
            <ClassFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
                onRefetch={refetch}
            />
        </div>
    )
}

export default ClassPage
