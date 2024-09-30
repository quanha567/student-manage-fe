import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { ExamDetailResponse, examService } from '@/services'

export const useGetExamDetail = (id?: number) => {
    return useQuery<ExamDetailResponse, Error, ExamDetailResponse>({
        queryKey: [QUERY_KEYS.SEMESTER, id],
        enabled: Boolean(id),
        queryFn: () => examService.get(Number(id)),
    })
}
