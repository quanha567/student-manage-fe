import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { semesterService } from '@/services'

export const useSemesterOptions = () => {
    const [semesterSearchText, setSemesterSearchText] = useState<string>(
        INITIAL_QUERY.SEARCH_VALUE,
    )

    const {
        data: semesters,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.SEMESTER_LIST_OPTIONS, semesterSearchText],
        queryFn: ({ pageParam }) =>
            semesterService.search({
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[name][$containsi]': semesterSearchText,
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: INITIAL_QUERY.PAGE_INDEX,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const semesterOptions = useMemo(() => {
        return semesters?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.name,
                value: data.id,
            })) as DefaultOptionType[]
    }, [semesters])

    const loadMoreSemesterOptions = useCallback(
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
        isLoadingSemesterOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        semesterOptions,
        loadMoreSemesterOptions,
        semesterSearchText,
        setSemesterSearchText,
    }
}
