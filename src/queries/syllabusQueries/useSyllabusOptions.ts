import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { syllabusService } from '@/services'

export const useSyllabusOptions = () => {
    const [syllabusSearchText, setSyllabusSearchText] = useState<string>(
        INITIAL_QUERY.SEARCH_VALUE,
    )

    const {
        data: syllabuses,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.SYLLABUS_LIST_OPTIONS, syllabusSearchText],
        queryFn: ({ pageParam }) =>
            syllabusService.search({
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[name][$containsi]': syllabusSearchText,
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: INITIAL_QUERY.PAGE_INDEX,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const syllabusOptions = useMemo(() => {
        return syllabuses?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.name,
                value: data.id,
            })) as DefaultOptionType[]
    }, [syllabuses])

    const loadMoreSyllabusOptions = useCallback(
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
        isLoadingSyllabusOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        syllabusOptions,
        loadMoreSyllabusOptions,
        syllabusSearchText,
        setSyllabusSearchText,
    }
}
