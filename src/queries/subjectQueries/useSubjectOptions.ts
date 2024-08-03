import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { subjectService } from '@/services'

export const useSubjectOptions = () => {
    const [subjectSearchText, setSubjectSearchText] = useState<string>(
        INITIAL_QUERY.SEARCH_VALUE,
    )

    const {
        data: subjects,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.SUBJECT_LIST_OPTIONS, subjectSearchText],
        queryFn: ({ pageParam }) =>
            subjectService.search({
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[name][$containsi]': subjectSearchText,
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: INITIAL_QUERY.PAGE_SIZE,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const subjectOptions = useMemo(() => {
        return subjects?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.name,
                value: data.id,
            })) as DefaultOptionType[]
    }, [subjects])

    const loadMoreSubjectOptions = useCallback(
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
        isLoadingSubjectOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        subjectOptions,
        loadMoreSubjectOptions,
        subjectSearchText,
        setSubjectSearchText,
    }
}
