import { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { DefaultOptionType } from 'antd/es/select'

import { INITIAL_QUERY, QUERY_KEYS } from '@/constants'
import { roomService } from '@/services'

export const useRoomOptions = () => {
    const [roomSearchText, setRoomSearchText] = useState<string>()

    const {
        data: rooms,
        isLoading,
        isFetching,
        isFetchingNextPage,
        isPlaceholderData,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.ROOM_LIST_OPTIONS, roomSearchText],
        queryFn: ({ pageParam }) =>
            roomService.search({
                populate: '*',
                'pagination[page]': pageParam,
                'pagination[pageSize]': INITIAL_QUERY.PAGE_SIZE,
                'filters[name][$containsi]': roomSearchText ?? '',
                'sort[0]': `createdAt:desc`,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.meta?.pagination?.page ===
            lastPage.meta?.pagination?.pageCount
                ? undefined
                : Number(lastPage.meta?.pagination?.page) + 1,
    })

    const roomOptions = useMemo(() => {
        return rooms?.pages
            .flatMap((page) => page.data ?? [])
            .map((data) => ({
                label: data.attributes?.name,
                value: data.id,
            })) as DefaultOptionType[]
    }, [rooms])

    const loadMoreRoomOptions = useCallback(
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
        isLoadingRoomOptions:
            isLoading ||
            ((isFetching || isFetchingNextPage) && isPlaceholderData),
        roomOptions,
        loadMoreRoomOptions,
        roomSearchText,
        setRoomSearchText,
    }
}
