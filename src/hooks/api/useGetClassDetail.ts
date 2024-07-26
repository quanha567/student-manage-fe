import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { ClassDetailResponse, classService } from '@/services'

export const useGetClassDetail = (id?: number) => {
    return useQuery<ClassDetailResponse, Error, ClassDetailResponse>({
        queryKey: [QUERY_KEYS.CLASS, id],
        enabled: Boolean(id),
        queryFn: () => classService.get(Number(id)),
    })
}
