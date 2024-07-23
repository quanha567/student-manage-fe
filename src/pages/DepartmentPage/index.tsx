import {
    EditFilled,
    ExclamationOutlined,
    SettingFilled,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'

import { Input, Modal, Pagination, Popover, Radio, Table, Tooltip } from 'antd'
import { ColumnType } from 'antd/es/table'

import { Breadcrumb, Button } from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useDisclosure } from '@/hooks'
import { DepartmentModel } from '@/models'
import { departmentService } from '@/services'
import { ResponseData } from '@/types'

import { DepartmentFormModal } from './components'

const DepartmentPage = () => {
    const { isOpen, toggleOpen, id } = useDisclosure()

    // const [modalDelete, setModalDelete] = useState()

    const { data: departments, isLoading: isLoadingDepartments } = useQuery({
        queryKey: [QUERY_KEYS.DEPARTMENTS],
        queryFn: async () =>
            await departmentService.search({
                'pagination[pageSize]': 10,
                'pagination[page]': 2,
            }),
    })

    const columns: ColumnType<ResponseData<DepartmentModel>>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            align: 'center',
            sorter: true,
        },
        {
            title: 'Tên khoa',
            dataIndex: 'attributes',
            render: ({ departmentName }: DepartmentModel) => departmentName,
            sorter: true,
        },
        {
            title: 'Hành động',
            width: 160,
            dataIndex: 'attributes',
            align: 'center',
            render: (id: string) => (
                <Radio.Group value="">
                    <Tooltip title="Chỉnh sửa">
                        <Radio.Button
                            value={2}
                            onClick={() => {
                                toggleOpen(id)
                            }}
                            className="text-zinc-500 hover:text-zinc-500"
                        >
                            <EditFilled />
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip title="Xóa" color="red">
                        {/* <Radio.Button
                            value={2}
                            onClick={() => {
                                setModalDelete({
                                    isOpen: true,
                                    id,
                                })
                            }}
                            className="text-red-500 hover:text-red-500"
                        >
                            <DeleteFilled />
                        </Radio.Button> */}
                    </Tooltip>
                </Radio.Group>
            ),
        },
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
            <Table
                title={() => (
                    <div className="flex justify-between">
                        <Input.Search
                            className="max-w-[300px]"
                            placeholder="Tìm kiếm tên khoa..."
                        />
                        <Popover
                            trigger="click"
                            placement="leftTop"
                            title={<div>Click me</div>}
                        >
                            <Button size="middle" type="text">
                                <SettingFilled className="text-xl" />
                            </Button>
                        </Popover>
                    </div>
                )}
                onChange={(pagination, filter, sorter) => {
                    console.log('pagination', pagination)
                    console.log('filter', filter)
                    console.log('sorter', sorter)
                }}
                rowSelection={{
                    type: 'checkbox',
                }}
                loading={isLoadingDepartments}
                className="overflow-hidden rounded-lg border-none bg-white drop-shadow"
                rowKey="id"
                columns={columns}
                dataSource={departments?.data}
                pagination={{
                    total: 20,
                }}
            />
            <Pagination
                align="end"
                className="mt-4"
                total={departments?.meta?.pagination?.total}
            />
            <DepartmentFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
            />
            <Modal
                centered
                // open={modalDelete?.isOpen}
                // onCancel={() => {
                //     setModalDelete({})
                // }}
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
