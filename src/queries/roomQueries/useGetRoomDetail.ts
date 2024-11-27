import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { RoomDetailResponse, roomService } from '@/services'

export const useGetRoomDetail = (id?: number) => {
    return useQuery<RoomDetailResponse, Error, RoomDetailResponse>({
        queryKey: [QUERY_KEYS.ROOM, id],
        enabled: Boolean(id),
        queryFn: () => roomService.get(Number(id)),
    })
}
