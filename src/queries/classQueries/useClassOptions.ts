import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { classService } from '@/services'

export const useClassOptions = () => {
    const [classSearchText, setClassSearchText] = useState<string>()

    const {
        data: classes,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.CLASS_LIST_OPTIONS, classSearchText],
        queryFn: ({ pageParam }) =>
            classService.search({
                populate: '*',
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[className][$containsi]': classSearchText ?? '',
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const classOptions = useMemo(() => {
        return classes?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.className,
                value: data.id,
            })) as DefaultOptionType[]
    }, [classes])

    const loadMoreClassOptions = useCallback(
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
        isLoadingClassOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        classOptions,
        loadMoreClassOptions,
        classSearchText,
        setClassSearchText,
    }
}
