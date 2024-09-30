import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { SemesterListResponse, semesterService } from '@/services'

interface GetSemesterParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetSemesters = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetSemesterParams) => {
    return useQuery<SemesterListResponse, Error, SemesterListResponse>({
        queryKey: [
            QUERY_KEYS.SEMESTER_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await semesterService.search({
                populate: 'deep',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[name][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
