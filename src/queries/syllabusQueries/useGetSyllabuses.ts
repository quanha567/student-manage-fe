import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { SyllabusListResponse, syllabusService } from '@/services'

interface GetSyllabusParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetSyllabuses = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetSyllabusParams) => {
    return useQuery<SyllabusListResponse, Error, SyllabusListResponse>({
        queryKey: [
            QUERY_KEYS.SYLLABUS_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await syllabusService.search({
                populate: 'deep',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[name][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
