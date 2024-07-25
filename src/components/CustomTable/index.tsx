import {
    Key,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    CloseOutlined,
    DeleteFilled,
    EditFilled,
    ExclamationOutlined,
    SettingFilled,
} from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { BiColumns } from 'react-icons/bi'
import { CgSize } from 'react-icons/cg'

import {
    Button,
    Checkbox,
    Modal,
    Popover,
    Radio,
    Table,
    TableProps,
    Tooltip,
} from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { ColumnType } from 'antd/es/table'
import { ColumnGroupType, SorterResult } from 'antd/es/table/interface'

import { useSearch } from '@/hooks'
import { Data } from '@/types'

import { TableSearchInput, TableSearchInputProps } from '../TableSearchInput'

interface TableOptionType {
    label: string
    value: SizeType
}

interface ActionButtonProps<T> {
    isDisplay?: boolean
    onClick?: (data: Data<T>) => void
}

const tableSizeOptions: TableOptionType[] = [
    {
        label: 'Nhỏ',
        value: 'small',
    },
    {
        label: 'Vừa',
        value: 'middle',
    },
    {
        label: 'Lớn',
        value: 'large',
    },
]

interface ActionButton<T> {
    deleteProps?: ActionButtonProps<T>
    editProps?: ActionButtonProps<T>
}

interface SearchParamsType {
    asc?: string
    pageIndex?: number
    pageSize?: number
    sortBy?: string
}

type CustomTableProps<T> = Omit<TableProps<T>, 'columns'> & {
    tableName: string
    isPagination?: boolean
    totalElement?: number
    searchInputProps?: TableSearchInputProps
    columns?: CustomTableColumnType<T>
    actionButtons?: ActionButton<T>
    onDelete?: (ids: number[]) => Promise<void>
}

export type CustomTableColumnType<T> = (ColumnType<Data<T>> & {
    display?: boolean
})[]

interface ModelDeleteType {
    isOpen?: boolean
}

export const CustomTable = <T extends AnyObject>({
    tableName,
    isPagination,
    totalElement,
    searchInputProps,
    onDelete,
    actionButtons = { editProps: {}, deleteProps: {} },
    ...tableProps
}: CustomTableProps<T>) => {
    const [params, setParams] = useSearch()

    const [modalDelete, setModalDelete] = useState<ModelDeleteType>()

    const [tableSelectedRowKeys, setTableSelectedRowKey] = useState<Key[]>()

    const { pageIndex = 1, pageSize = 10 } = params
    const { columns = [], size = 'middle' } = tableProps

    const [columnKeySelected, setColumnKeySelected] = useState<unknown[]>()

    const [tableSize, setTableSize] = useState<SizeType>(size)

    useEffect(() => {
        const displayColumnKeys =
            Array.isArray(columns) && columns.length > 0
                ? columns
                      .filter((column) => column.display)
                      .map((column) => column.key)
                      .filter(Boolean)
                : []
        setColumnKeySelected(displayColumnKeys)
    }, [columns, setColumnKeySelected])

    const newColumns = useMemo(() => {
        let columnFilter = columns.map((column) => ({
            ...column,
            hidden: Boolean(
                !column.key || !columnKeySelected?.includes(column.key),
            ),
        }))
        const numberOfButtonAction = Object.values(actionButtons).filter(
            (button) => button.isDisplay,
        ).length

        if (numberOfButtonAction) {
            const { editProps, deleteProps } = actionButtons

            columnFilter = [
                ...columnFilter,
                {
                    title: 'Hành động',
                    dataIndex: 'attributes',
                    align: 'center',
                    render: (_, record: Data<T>) => (
                        <Radio.Group value="" size={tableSize}>
                            {editProps?.isDisplay && (
                                <Tooltip title="Chỉnh sửa" color="blue">
                                    <Radio.Button
                                        value={2}
                                        onClick={() => {
                                            if (editProps.onClick)
                                                editProps.onClick(record)
                                        }}
                                        className="text-sky-500 hover:text-sky-500"
                                    >
                                        <EditFilled />
                                    </Radio.Button>
                                </Tooltip>
                            )}
                            {deleteProps?.isDisplay && (
                                <Tooltip title="Xóa" color="red">
                                    <Radio.Button
                                        value={2}
                                        onClick={() => {
                                            if (record.id) {
                                                setTableSelectedRowKey([
                                                    record.id,
                                                ])
                                                setModalDelete({
                                                    isOpen: true,
                                                })
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-500"
                                    >
                                        <DeleteFilled />
                                    </Radio.Button>
                                </Tooltip>
                            )}
                        </Radio.Group>
                    ),
                    hidden: false,
                    fixed: 'right',
                },
            ]
        }

        return columnFilter
    }, [columns, actionButtons, columnKeySelected, tableSize])

    const handleToggleDisplayColumn = useCallback(
        (columnKey?: Key) => {
            if (!columnKey) return

            if (columnKeySelected?.includes(columnKey)) {
                setColumnKeySelected(
                    columnKeySelected.filter((key) => key !== columnKey),
                )
            } else {
                setColumnKeySelected([...(columnKeySelected ?? []), columnKey])
            }
        },
        [columnKeySelected, setColumnKeySelected],
    )

    const renderSetting = useMemo(() => {
        return (
            <div>
                <p className="text-center text-base font-bold">
                    Cài đặt hiển thị
                </p>
                <div className="divide-y-[1px] divide-zinc-100 border-y border-zinc-100">
                    <div className="py-2">
                        <p className="flex items-center gap-1">
                            <BiColumns className="size-5" />
                            <span className="font-bold">Cột</span>
                        </p>
                        <div className="mt-2 grid grid-cols-3 gap-1">
                            {columns.map((column) => (
                                <div
                                    onClick={() => {
                                        handleToggleDisplayColumn(column.key)
                                    }}
                                    key={column.key}
                                    className="flex cursor-pointer gap-1 rounded-lg px-1 py-0.5 transition-all hover:bg-zinc-100"
                                >
                                    <Checkbox
                                        checked={Boolean(
                                            column.key &&
                                                columnKeySelected?.includes(
                                                    column.key,
                                                ),
                                        )}
                                    />
                                    {column.title as ReactNode}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="py-2">
                        <p className="flex items-center gap-1">
                            <CgSize className="size-5" />
                            <span className="font-bold">Kích thước</span>
                        </p>
                        <div className="mt-2 grid grid-cols-3 gap-1">
                            {tableSizeOptions.map((sizeOption) => (
                                <div
                                    onClick={() => {
                                        setTableSize(sizeOption.value)
                                    }}
                                    key={sizeOption.value}
                                    className="flex cursor-pointer gap-1 rounded-lg px-1 py-0.5 transition-all hover:bg-zinc-100"
                                >
                                    <Radio
                                        checked={tableSize === sizeOption.value}
                                    />
                                    <span>{sizeOption.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [columns, columnKeySelected, handleToggleDisplayColumn, tableSize])

    const handleDeleteFinish = () => {
        setTableSelectedRowKey([])
        setModalDelete({
            isOpen: false,
        })
    }

    const { isPending: isDeleting, mutate: deleteData } = useMutation({
        mutationKey: [tableName, tableSelectedRowKeys],
        mutationFn: onDelete,
        onError: handleDeleteFinish,
        onSuccess: handleDeleteFinish,
    })

    return (
        <>
            <Table<T>
                title={() =>
                    tableSelectedRowKeys?.length ? (
                        <div className="space-x-2">
                            <Button
                                onClick={() =>
                                    setModalDelete({
                                        isOpen: true,
                                    })
                                }
                                size={tableSize}
                                type="primary"
                                danger
                            >
                                <DeleteFilled />
                                Xóa tất cả {tableSelectedRowKeys.length} /{' '}
                                {totalElement} {tableName}
                            </Button>
                            <Button
                                type="default"
                                onClick={() => setTableSelectedRowKey([])}
                                size={tableSize}
                            >
                                <CloseOutlined />
                                Bỏ chọn tất cả
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between">
                            <TableSearchInput
                                {...searchInputProps}
                                size={tableSize}
                            />
                            <Popover
                                trigger="click"
                                placement="leftTop"
                                title={renderSetting}
                            >
                                <Button size="middle" type="text">
                                    <SettingFilled className="text-xl" />
                                </Button>
                            </Popover>
                        </div>
                    )
                }
                onChange={(pagination, _, sorter) => {
                    const { pageSize, current } = pagination
                    const { columnKey, order } = sorter as SorterResult<T>

                    const newSearchParams: SearchParamsType = {
                        ...params,
                        pageIndex: current,
                        pageSize,
                        sortBy: String(columnKey),
                        asc: order ?? '',
                    }

                    if (!order) {
                        delete newSearchParams.asc
                        delete newSearchParams.sortBy
                    }

                    setParams(newSearchParams as Record<string, unknown>)
                }}
                rowSelection={{
                    type: 'checkbox',
                    fixed: 'left',
                    selectedRowKeys: tableSelectedRowKeys,
                    onChange: setTableSelectedRowKey,
                    preserveSelectedRowKeys: true,
                }}
                rowKey="id"
                className="overflow-hidden rounded-lg border-none bg-white drop-shadow"
                {...tableProps}
                pagination={
                    isPagination
                        ? {
                              total: totalElement ?? 0,
                              showSizeChanger: true,
                              showTitle: true,
                              showTotal: (totalElement, [from, to]) => (
                                  <span className="hidden select-none font-bold md:block">
                                      Đang hiển thị từ {from} - {to} /{' '}
                                      {totalElement} {tableName}
                                  </span>
                              ),
                              responsive: true,
                              pageSize: Number(pageSize || 10),
                              current: Number(pageIndex || 1),
                          }
                        : false
                }
                columns={newColumns as (ColumnGroupType<T> | ColumnType<T>)[]}
                size={tableSize}
                scroll={{
                    x: 'max-content',
                }}
                loading={isDeleting || tableProps.loading}
            />
            <Modal
                centered
                open={modalDelete?.isOpen}
                onCancel={() => {
                    setModalDelete({})
                    setTableSelectedRowKey([])
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
                        size="large"
                        type="default"
                        className="w-full hover:!border-transparent hover:!bg-zinc-500 hover:!text-white"
                    >
                        Hủy
                    </Button>
                    <Button
                        size="large"
                        loading={isDeleting}
                        className="w-full bg-red-500 text-white"
                        onClick={() =>
                            deleteData((tableSelectedRowKeys ?? []) as number[])
                        }
                    >
                        Đồng ý
                    </Button>
                </div>
            </Modal>
        </>
    )
}
