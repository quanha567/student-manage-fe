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
import { DepartmentModel, TeacherModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetTeachers } from '@/queries'
import { teacherService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { TeacherFormModal } from './components'

const PageName = 'giảng viên'

const columns: CustomTableColumnType<Data<TeacherModel>> = [
    {
        title: `Mã ${PageName}`,
        dataIndex: 'attributes',
        key: 'studentCode',
        render: ({ teacherCode }: TeacherModel) => teacherCode,
        sorter: true,
        display: true,
    },
    {
        title: <HiMiniPhoto className="mx-auto size-6" />,
        dataIndex: 'attributes',
        key: 'avatar',
        width: 80,
        render: ({ avatar, fullName }: TeacherModel) => (
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
        render: ({ fullName }: TeacherModel) => fullName,
        sorter: true,
        display: true,
    },
    {
        title: 'Lớp chủ nhiệm',
        dataIndex: 'attributes',
        key: 'className',
        render: ({ classes }: TeacherModel) => (
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
        display: true,
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'attributes',
        key: 'phoneNumber',
        render: ({ phoneNumber }: TeacherModel) => phoneNumber ?? '___',
        display: true,
    },
    {
        title: 'Giới tính',
        dataIndex: 'attributes',
        key: 'departmentName',
        render: ({ gender }: TeacherModel) =>
            gender ? GENDERS[gender] || '___' : '___',
        display: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: TeacherModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: TeacherModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const TeacherPage = () => {
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

    const { data, isLoading, isPlaceholderData, isFetching } = useGetTeachers({
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
                    deleteIds.map((id) => teacherService.delete(id)),
                )
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.TEACHER_LIST],
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
            <TeacherFormModal id={id} isOpen={isOpen} toggleOpen={toggleOpen} />
        </div>
    )
}

export default TeacherPage
