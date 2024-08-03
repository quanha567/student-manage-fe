import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { ClassListResponse, classService } from '@/services'

interface GetClassParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetClasses = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetClassParams) => {
    return useQuery<ClassListResponse, Error, ClassListResponse>({
        queryKey: [
            QUERY_KEYS.CLASS_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await classService.search({
                populate: '*',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[className][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
