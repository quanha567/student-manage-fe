import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { SubjectDetailResponse, subjectService } from '@/services'

export const useGetSubjectDetail = (id?: number) => {
    return useQuery<SubjectDetailResponse, Error, SubjectDetailResponse>({
        queryKey: [QUERY_KEYS.SUBJECT, id],
        enabled: Boolean(id),
        queryFn: () => subjectService.get(Number(id)),
    })
}
