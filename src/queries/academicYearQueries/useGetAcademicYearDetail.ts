import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { AcademicYearDetailResponse, academicYearService } from '@/services'

export const useGetAcademicYearDetail = (id?: number) => {
    return useQuery<
        AcademicYearDetailResponse,
        Error,
        AcademicYearDetailResponse
    >({
        queryKey: [QUERY_KEYS.ACADEMIC_YEAR_DETAIL, id],
        enabled: Boolean(id),
        queryFn: () => academicYearService.get(Number(id)),
    })
}
