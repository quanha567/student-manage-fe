import { useCallback } from 'react'

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
import { useDisclosure, useGetDepartments, useSearch } from '@/hooks'
import { DepartmentModel } from '@/models'
import { queryClient } from '@/providers'
import { departmentService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { DepartmentFormModal } from './components'

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
        title: 'Hình ảnh',
        dataIndex: 'attributes',
        key: 'avatar',
        width: 80,
        render: ({ avatar }: DepartmentModel) =>
            typeof avatar !== 'string' ? (
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
        pageSize = 10,
        pageIndex = 1,
        sortBy = 'createdAt',
        asc = 'desc',
        searchText = '',
    } = params

    const {
        data: departments,
        isLoading: isLoadingDepartments,
        isPlaceholderData: isPlaceholderDepartments,
    } = useGetDepartments({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteDepartment = useCallback(
        async (deleteIds: number[]) => {
            const firstId = deleteIds[0]
            if (!firstId) return

            try {
                const departmentDeleted =
                    await departmentService.delete(firstId)
                await queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.DEPARTMENT_LIST],
                })
                notification.success({
                    message: `Xóa khoa ${departmentDeleted.data?.attributes.departmentName ?? ''} thành công!`,
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
                pageName="Danh sách khoa"
                items={[
                    {
                        title: 'Danh sách khoa',
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
