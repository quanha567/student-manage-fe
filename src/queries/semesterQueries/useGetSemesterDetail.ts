import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { SemesterDetailResponse, semesterService } from '@/services'

export const useGetSemesterDetail = (id?: number) => {
    return useQuery<SemesterDetailResponse, Error, SemesterDetailResponse>({
        queryKey: [QUERY_KEYS.SEMESTER, id],
        enabled: Boolean(id),
        queryFn: () => semesterService.get(Number(id)),
    })
}
