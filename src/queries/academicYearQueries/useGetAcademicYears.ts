import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { AcademicYearListResponse, academicYearService } from '@/services'

interface GetAcademicYearParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetAcademicYears = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetAcademicYearParams) => {
    return useQuery<AcademicYearListResponse, Error, AcademicYearListResponse>({
        queryKey: [
            QUERY_KEYS.ACADEMIC_YEAR_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await academicYearService.search({
                populate: '*',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[name][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
