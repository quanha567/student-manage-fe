import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { SubjectListResponse, subjectService } from '@/services'

interface GetSubjectParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetSubjects = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetSubjectParams) => {
    return useQuery<SubjectListResponse, Error, SubjectListResponse>({
        queryKey: [
            QUERY_KEYS.SUBJECT_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await subjectService.search({
                populate: 'deep',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[name][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
