import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { SyllabusDetailResponse, syllabusService } from '@/services'

export const useGetSyllabusDetail = (id?: number) => {
    return useQuery<SyllabusDetailResponse, Error, SyllabusDetailResponse>({
        queryKey: [QUERY_KEYS.SYLLABUS, id],
        enabled: Boolean(id),
        queryFn: () => syllabusService.get(Number(id)),
    })
}
