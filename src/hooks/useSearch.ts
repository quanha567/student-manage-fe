import { useCallback, useMemo } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'

import qs from 'qs'

export const useSearch = () => {
    const [params, setSearchParams] = useSearchParams()

    const searchParams = useMemo(() => {
        const newSearchParams: Record<string, unknown> = {}

        params.forEach((_, key) => {
            const paramsValue = params.getAll(key)
            newSearchParams[key] =
                paramsValue.length === 1 ? paramsValue[0] : paramsValue
        })

        return newSearchParams
    }, [params])

    const setParams = useCallback(
        (values: Record<string, unknown>) => {
            const paramsAfterFilter = Object.keys(values).reduce(
                (acc: Record<string, unknown>, key: string) => {
                    const value = values[key]
                    if (
                        value ||
                        value === 0 ||
                        value === false ||
                        Array.isArray(value)
                    ) {
                        acc[key] = value
                    }
                    return acc
                },
                {},
            )

            setSearchParams(
                qs.stringify(paramsAfterFilter, {
                    arrayFormat: 'repeat',
                }) as URLSearchParamsInit,
                { replace: !Object.keys(paramsAfterFilter).length },
            )
        },
        [setSearchParams],
    )

    return [searchParams, setParams] as const
}
