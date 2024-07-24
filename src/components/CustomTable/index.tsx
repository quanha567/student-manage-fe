import React, { Key, useEffect, useMemo, useState } from 'react'

import { SettingFilled } from '@ant-design/icons'

import { Button, Input, Popover, Table, TableProps } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { ColumnType } from 'antd/es/table'

import { useSearch } from '@/hooks'
import { Data } from '@/types'

interface SearchParamsType {
    asc?: string
    pageIndex?: number
    pageSize?: number
    sortBy?: string
}

type CustomTableProps<T> = TableProps<T> & {
    tableName: string
    isPagination?: boolean
    totalElement?: number
}

export type CustomTableColumnType<T> = (ColumnType<Data<T>> & {
    display?: boolean
})[]

const useDebounce = (callback: (...args: unknown[]) => void, delay: number) => {
    const callbackRef = React.useRef(callback)

    React.useLayoutEffect(() => {
        callbackRef.current = callback
    })

    let timer: number

    const naiveDebounce = (
        func: (...args: unknown[]) => void,
        delayMs: number,
        ...args: unknown[]
    ) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(...args)
        }, delayMs)
    }

    return React.useMemo(
        () =>
            (...args: unknown[]) => {
                naiveDebounce(callbackRef.current, delay, ...args)
            },
        [delay],
    )
}

export const CustomTable = <T extends AnyObject>({
    tableName,
    isPagination,
    totalElement,
    ...tableProps
}: CustomTableProps<T>) => {
    const [params, setParams] = useSearch()

    const { pageIndex = 1, pageSize = 10 } = params
    const { columns = [] } = tableProps

    const [columnKeySelected, setColumnKeySelected] = useState<Key[]>()

    const [searchText, setSearchText] = useState<string>('')

    const debouncedCallback = useDebounce((newValue) => {
        setParams({ ...params, searchText: newValue })
    }, 700)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        debouncedCallback(e.target.value)
    }

    useEffect(() => {
        const displayColumnKeys =
            Array.isArray(columns) && columns.length > 0
                ? columns.map((column) => column.key ?? '').filter(Boolean)
                : []
        setColumnKeySelected(displayColumnKeys)
    }, [columns, setColumnKeySelected])

    const newColumns = useMemo(() => {
        return columns.map((column) => ({
            ...column,
            hidden: Boolean(
                !column.key || !columnKeySelected?.includes(column.key),
            ),
        }))
    }, [columns, columnKeySelected])

    return (
        <>
            <Table<T>
                title={() => (
                    <div className="flex justify-between">
                        <Input.Search
                            className="max-w-[300px]"
                            placeholder="Tìm kiếm tên khoa..."
                            value={searchText}
                            onChange={handleChange}
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
                    const { pageSize, current } = pagination
                    const { columnKey, order } = sorter ?? {}
                    console.log(sorter)

                    const newSearchParams: SearchParamsType = {
                        ...params,
                        pageIndex: current,
                        pageSize,
                        sortBy: columnKey,
                        asc: order,
                    }

                    if (!order) {
                        delete newSearchParams.asc
                        delete newSearchParams.sortBy
                    }

                    setParams(newSearchParams as Record<string, unknown>)
                }}
                rowSelection={{
                    type: 'checkbox',
                }}
                className="overflow-hidden rounded-lg border-none bg-white drop-shadow"
                rowKey="id"
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
                columns={newColumns}
            />
        </>
    )
}
