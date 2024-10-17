import { useCallback } from 'react'

import { HiMiniPhoto } from 'react-icons/hi2'
import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomImage,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { GENDERS, QUERY_KEYS } from '@/constants'
import { useDisclosure, useSearch } from '@/hooks'
import { DepartmentModel, StudentModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetStudents } from '@/queries'
import { studentService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { ClassFormModal } from './components'

const PageName = 'sinh viên'

const columns: CustomTableColumnType<Data<StudentModel>> = [
    {
        title: `Mã ${PageName}`,
        dataIndex: 'attributes',
        key: 'studentCode',
        render: ({ studentCode }: StudentModel) => studentCode,
        sorter: true,
        display: true,
    },
    {
        title: <HiMiniPhoto className="mx-auto size-6" />,
        dataIndex: 'attributes',
        key: 'avatar',
        width: 80,
        render: ({ avatar, fullName }: StudentModel) => (
            <CustomImage
                src={avatar}
                alt={fullName}
                className="aspect-square object-cover"
                size="thumbnail"
            />
        ),
        display: true,
    },
    {
        title: `Tên ${PageName}`,
        dataIndex: 'attributes',
        key: 'fullName',
        render: ({ fullName }: StudentModel) => fullName,
        sorter: true,
        display: true,
    },
    {
        title: 'Lớp',
        dataIndex: 'attributes',
        key: 'className',
        render: ({ class: classInfo }: StudentModel) =>
            classInfo?.data?.attributes?.className ?? '___',
        display: true,
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'attributes',
        key: 'phoneNumber',
        render: ({ phoneNumber }: StudentModel) => phoneNumber ?? '___',
        display: true,
    },
    {
        title: 'Giới tính',
        dataIndex: 'attributes',
        key: 'departmentName',
        render: ({ gender }: StudentModel) =>
            gender ? GENDERS[gender] || '___' : '___',
        display: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: StudentModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: StudentModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const StudentPage = () => {
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

    const { data, isLoading, isPlaceholderData, isFetching, refetch } =
        useGetStudents({
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            asc: String(asc),
            searchText: String(searchText),
            sortBy: String(sortBy),
        })

    const handleDelete = useCallback(
        async (deleteIds: number[]) => {
            try {
                const dataDeleted = await Promise.all(
                    deleteIds.map((id) => studentService.delete(id)),
                )
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.STUDENT_LIST],
                })
                notification.success({
                    message: `Đã xóa thành công ${String(dataDeleted.length)} dòng dữ liệu!`,
                })
            } catch (err: unknown) {
                console.log('delete', err)
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
                dataSource={data?.data}
                loading={isLoading || (isPlaceholderData && isFetching)}
                totalElement={data?.meta?.pagination?.total}
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
                onDelete={handleDelete}
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

export default StudentPage
