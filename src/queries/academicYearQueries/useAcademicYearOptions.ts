import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { academicYearService } from '@/services'

export const useAcademicYearOptions = () => {
    const [academicYearSearchText, setAcademicYearSearchText] =
        useState<string>()

    const {
        data: academicYears,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.ACADEMIC_YEAR, academicYearSearchText],
        queryFn: ({ pageParam }) =>
            academicYearService.search({
                populate: '*',
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[name][$containsi]': academicYearSearchText ?? '',
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const academicYearOptions = useMemo(() => {
        return academicYears?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.name,
                value: data.id,
            })) as DefaultOptionType[]
    }, [academicYears])

    const loadMoreAcademicYearOptions = useCallback(
        async (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement
            const tolerance = 10

            if (
                Math.ceil(target.scrollTop + target.offsetHeight + tolerance) >=
                    target.scrollHeight &&
                !isFetchingNextPage &&
                hasNextPage
            )
                await fetchNextPage()
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage],
    )

    return {
        isLoadingAcademicYearOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        academicYearOptions,
        loadMoreAcademicYearOptions,
        academicYearSearchText,
        setAcademicYearSearchText,
    }
}
