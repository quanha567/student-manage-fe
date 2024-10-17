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
import { ClassModel, DepartmentModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetClasses } from '@/queries'
import { departmentService } from '@/services'
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
        data: departments,
        isLoading: isLoadingDepartments,
        isPlaceholderData: isPlaceholderDepartments,
    } = useGetClasses({
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
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.DEPARTMENT_LIST],
                })
                notification.success({
                    message: `Xóa ${PageName} ${departmentDeleted.data?.attributes?.departmentName ?? ''} thành công!`,
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
                dataSource={departments?.data}
                loading={isLoadingDepartments || isPlaceholderDepartments}
                totalElement={departments?.meta?.pagination?.total}
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
            <ClassFormModal id={id} isOpen={isOpen} toggleOpen={toggleOpen} />
        </div>
    )
}

export default ClassPage
