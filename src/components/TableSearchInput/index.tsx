import { useCallback, useEffect, useState } from 'react'

import { Input, InputProps } from 'antd'

import { useDebounce, useSearch } from '@/hooks'

export type TableSearchInputProps = Omit<InputProps, 'value' | 'onChange'> & {
    isDisplay?: boolean
}

export const TableSearchInput = ({
    isDisplay,
    ...props
}: TableSearchInputProps) => {
    const [params, setParams] = useSearch()

    const [searchText, setSearchText] = useState<string>('')

    const debouncedCallback = useDebounce((newValue) => {
        setParams({ ...params, searchText: newValue })
    }, 700)

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(e.target.value)
            debouncedCallback(e.target.value)
        },
        [debouncedCallback],
    )

    useEffect(() => {
        if (params.searchText && params.searchText !== searchText && isDisplay)
            setSearchText(String(params.searchText))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisplay])

    return isDisplay ? (
        <Input.Search
            className="max-w-[300px]"
            value={searchText}
            onChange={handleChange}
            {...props}
        />
    ) : (
        <div></div>
    )
}
