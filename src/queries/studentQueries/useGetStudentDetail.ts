import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { StudentDetailResponse, studentService } from '@/services'

export const useGetStudentDetail = (id?: number) => {
    return useQuery<StudentDetailResponse, Error, StudentDetailResponse>({
        queryKey: [QUERY_KEYS.STUDENT, id],
        enabled: Boolean(id),
        queryFn: () => studentService.get(Number(id)),
    })
}
