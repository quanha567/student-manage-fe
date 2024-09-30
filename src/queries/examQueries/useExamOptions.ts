import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { examService } from '@/services'

export const useExamOptions = () => {
    const [examSearchText, setExamSearchText] = useState<string>(
        INITIAL_QUERY.SEARCH_VALUE,
    )

    const {
        data: exams,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.EXAM_LIST_OPTIONS, examSearchText],
        queryFn: ({ pageParam }) =>
            examService.search({
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[examName][$containsi]': examSearchText,
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: INITIAL_QUERY.PAGE_INDEX,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const examOptions = useMemo(() => {
        return exams?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.examName,
                value: data.id,
            })) as DefaultOptionType[]
    }, [exams])

    const loadMoreExamOptions = useCallback(
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
        isLoadingExamOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        examOptions,
        loadMoreExamOptions,
        examSearchText,
        setExamSearchText,
    }
}
