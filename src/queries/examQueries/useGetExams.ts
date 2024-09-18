import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { ExamListResponse, examService } from '@/services'

interface GetExamParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetExams = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetExamParams) => {
    return useQuery<ExamListResponse, Error, ExamListResponse>({
        queryKey: [
            QUERY_KEYS.SEMESTER_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await examService.search({
                populate: 'deep',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[examName][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
