import { useCallback } from 'react'

import { useQuery } from '@tanstack/react-query'
import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomImage,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useDisclosure, useSearch } from '@/hooks'
import { DepartmentModel } from '@/models'
import { departmentService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { DepartmentFormModal } from './components'

const columns: CustomTableColumnType<Data<DepartmentModel>> = [
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
        title: 'Hình ảnh',
        dataIndex: 'attributes',
        key: 'avatar',
        width: 80,
        render: ({ avatar }: DepartmentModel) =>
            avatar?.data ? (
                <CustomImage
                    src={avatar}
                    className="aspect-square object-cover"
                    size="thumbnail"
                />
            ) : (
                <></>
            ),
        display: true,
    },
    {
        title: 'Tên khoa',
        dataIndex: 'attributes',
        key: 'departmentName',
        render: ({ departmentName }: DepartmentModel) => departmentName,
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: DepartmentModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: DepartmentModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const DepartmentPage = () => {
    const { isOpen, toggleOpen, id } = useDisclosure()

    const { notification } = App.useApp()

    const [params] = useSearch()
    const {
        pageSize,
        pageIndex,
        sortBy = 'createdAt',
        asc = 'desc',
        searchText,
    } = params

    const {
        data: departments,
        isLoading: isLoadingDepartments,
        isPlaceholderData: isPlaceholderDepartments,
        refetch: refetchDepartments,
    } = useQuery({
        queryKey: [
            QUERY_KEYS.DEPARTMENT_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await departmentService.search({
                populate: '*',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[departmentName][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })

    const handleDeleteDepartment = useCallback(
        async (deleteIds: number[]) => {
            const firstId = deleteIds[0]
            if (!firstId) return

            try {
                const departmentDeleted =
                    await departmentService.delete(firstId)
                await refetchDepartments()
                notification.success({
                    message: `Xóa khoa ${departmentDeleted.data?.attributes.departmentName ?? ''} thành công!`,
                })
            } catch (err: unknown) {
                console.log('Department delete', err)
            }
        },
        [notification, refetchDepartments],
    )

    return (
        <div>
            <Breadcrumb
                pageName="Danh sách khoa"
                renderRight={
                    <Button
                        size="middle"
                        className="drop-shadow-primary ml-auto flex items-center drop-shadow"
                        onClick={() => toggleOpen()}
                    >
                        <IoMdAdd />
                        Thêm
                    </Button>
                }
            />

            <CustomTable
                columns={columns}
                dataSource={departments?.data}
                loading={isLoadingDepartments || isPlaceholderDepartments}
                tableName="khoa"
                isPagination
                totalElement={departments?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: 'Tìm kiếm tên khoa...',
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
            <DepartmentFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
            />
        </div>
    )
}

export default DepartmentPage
