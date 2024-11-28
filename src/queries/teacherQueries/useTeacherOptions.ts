import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { teacherService } from '@/services'

export const useTeacherOptions = () => {
    const [teacherSearchText, setTeacherSearchText] = useState<string>(
        INITIAL_QUERY.SEARCH_VALUE,
    )

    const {
        data: teachers,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.TEACHER_OPTIONS, teacherSearchText],
        queryFn: ({ pageParam }) =>
            teacherService.search({
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[fullName][$containsi]': teacherSearchText,
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: INITIAL_QUERY.PAGE_INDEX,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const teacherOptions = useMemo(() => {
        return teachers?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.fullName,
                value: data.id,
            })) as DefaultOptionType[]
    }, [teachers])

    const loadMoreTeacherOptions = useCallback(
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
        isLoadingTeacherOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        teacherOptions,
        loadMoreTeacherOptions,
        teacherSearchText,
        setTeacherSearchText,
    }
}
