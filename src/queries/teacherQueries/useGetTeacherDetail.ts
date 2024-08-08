import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { TeacherDetailResponse, teacherService } from '@/services'

export const useGetTeacherDetail = (id?: number) => {
    return useQuery<TeacherDetailResponse, Error, TeacherDetailResponse>({
        queryKey: [QUERY_KEYS.TEACHER, id],
        enabled: Boolean(id),
        queryFn: () => teacherService.get(Number(id)),
    })
}
