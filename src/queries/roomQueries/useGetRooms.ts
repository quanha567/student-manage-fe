import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { RoomListResponse, roomService } from '@/services'

interface GetRoomParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetRooms = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetRoomParams) => {
    return useQuery<RoomListResponse, Error, RoomListResponse>({
        queryKey: [
            QUERY_KEYS.ROOM_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await roomService.search({
                populate: '*',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[name][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
