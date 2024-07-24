import { useState } from 'react'

import { ExclamationOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'

import { Modal } from 'antd'

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

const DepartmentPage = () => {
    const { isOpen, toggleOpen, id } = useDisclosure()

    const [modalDelete, setModalDelete] = useState()

    const [params] = useSearch()
    const {
        pageSize,
        pageIndex,
        sortBy = 'createdAt',
        asc = 'desc',
        searchText,
    } = params

    console.log(searchText)

    const {
        data: departments,
        isLoading: isLoadingDepartments,
        isPlaceholderData: isPlaceholderDepartments,
    } = useQuery({
        queryKey: [
            QUERY_KEYS.DEPARTMENTS,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await departmentService.search({
                'pagination[pageSize]': pageSize,
                'pagination[page]': pageIndex,
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
                populate: '*',
                'filters[departmentName][$containsi]': searchText ?? '',
            }),
    })

    const columns: CustomTableColumnType<DepartmentModel> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            align: 'center',
            sorter: true,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'attributes',
            key: 'avatar',
            width: 100,
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
        },
        {
            title: 'Tên khoa',
            dataIndex: 'attributes',
            key: 'departmentName',
            render: ({ departmentName }: DepartmentModel) => departmentName,
            sorter: true,
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'attributes',
            key: 'createdAt',
            render: ({ createdAt }: DepartmentModel) =>
                createdAt ? formatDateTime(createdAt) : '___',
            sorter: true,
        },
        {
            title: 'Giời gian cập nhật',
            dataIndex: 'attributes',
            key: 'updatedAt',
            render: ({ updatedAt }: DepartmentModel) =>
                updatedAt ? formatDateTime(updatedAt) : '___',
            sorter: true,
        },
        // {
        //     title: 'Hành động',
        //     width: 160,
        //     dataIndex: 'attributes',
        //     align: 'center',
        //     render: (id: string) => (
        //         <Radio.Group value="">
        //             <Tooltip title="Chỉnh sửa">
        //                 <Radio.Button
        //                     value={2}
        //                     onClick={() => {
        //                         toggleOpen(id)
        //                     }}
        //                     className="text-zinc-500 hover:text-zinc-500"
        //                 >
        //                     <EditFilled />
        //                 </Radio.Button>
        //             </Tooltip>
        //             <Tooltip title="Xóa" color="red">
        //                 <Radio.Button
        //                     value={2}
        //                     onClick={() => {
        //                         setModalDelete({
        //                             isOpen: true,
        //                             id,
        //                         })
        //                     }}
        //                     className="text-red-500 hover:text-red-500"
        //                 >
        //                     <DeleteFilled />
        //                 </Radio.Button>
        //             </Tooltip>
        //         </Radio.Group>
        //     ),
        // },
    ]

    return (
        <div>
            <Breadcrumb pageName="Danh sách khoa" />
            <Button
                size="middle"
                className="drop-shadow-primary mb-4 ml-auto block drop-shadow"
                onClick={() => {
                    toggleOpen()
                }}
            >
                Thêm khoa mới
            </Button>

            <CustomTable<Data<DepartmentModel>>
                columns={columns}
                dataSource={departments?.data}
                loading={isLoadingDepartments || isPlaceholderDepartments}
                tableName="khoa"
                isPagination
                totalElement={departments?.meta?.pagination?.total}
            />
            <DepartmentFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
            />
            <Modal
                centered
                open={modalDelete?.isOpen}
                onCancel={() => {
                    setModalDelete({})
                }}
                classNames={{
                    body: 'flex flex-col items-center',
                }}
                footer={false}
            >
                <div className="flex size-28 items-center justify-center rounded-full bg-red-200">
                    <div className="flex size-20 items-center justify-center rounded-full bg-red-500">
                        <ExclamationOutlined className="text-4xl text-white" />
                    </div>
                </div>
                <p className="mt-2 text-xl font-bold">Xác nhận xóa</p>
                <p className="mt-2 text-pretty text-center text-base">
                    Bạn có chắc muốn xóa dữ liệu đã chọn? Sau khi xóa dữ liệu sẽ
                    không thể khôi phục.
                </p>
                <div className="mt-4 grid w-full grid-cols-2 gap-4 px-6">
                    <Button
                        className="w-full hover:!border-transparent hover:!bg-zinc-500 hover:!text-white"
                        type="default"
                    >
                        Hủy
                    </Button>
                    <Button className="w-full bg-red-500 hover:!bg-red-600">
                        Đồng ý
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default DepartmentPage
