import { useCallback } from 'react'

import { HiMiniPhoto } from 'react-icons/hi2'
import { IoMdAdd } from 'react-icons/io'

import { App, Avatar } from 'antd'

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
import { queryClient } from '@/providers'
import { useGetDepartments } from '@/queries'
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
        title: <HiMiniPhoto className="mx-auto size-6" />,
        dataIndex: 'attributes',
        key: 'avatar',
        width: 50,
        render: ({ avatar, departmentName }: DepartmentModel) =>
            typeof avatar !== 'string' && avatar?.data ? (
                <CustomImage
                    src={avatar}
                    className="aspect-square object-cover"
                    size="thumbnail"
                />
            ) : (
                <Avatar
                    shape="square"
                    style={{
                        borderRadius: 0,
                    }}
                    size={40}
                >
                    {departmentName?.charAt(0).toLocaleUpperCase()}
                </Avatar>
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
        title: 'Danh sách lớp',
        dataIndex: 'attributes',
        key: 'classes',
        render: ({ classes }: DepartmentModel) => (
            <div className="flex max-w-sm flex-wrap items-center gap-1">
                {classes?.data?.map((classInfo) => (
                    <div
                        key={classInfo.id}
                        className="rounded-lg bg-zinc-200 px-2 py-1 text-xs"
                    >
                        {classInfo.attributes?.className}
                    </div>
                ))}
            </div>
        ),
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
            try {
                const dataDeleted = await Promise.all(
                    deleteIds.map((id) => departmentService.delete(id)),
                )
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.DEPARTMENT_LIST],
                })
                notification.success({
                    message: `Đã xóa thành công ${String(dataDeleted.length)} dòng dữ liệu!`,
                })
            } catch (err: unknown) {
                console.log('Department delete', err)
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
