import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { DepartmentListResponse, departmentService } from '@/services'

interface GetDepartmentParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetDepartments = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetDepartmentParams) => {
    return useQuery<DepartmentListResponse, Error, DepartmentListResponse>({
        queryKey: [
            QUERY_KEYS.DEPARTMENT_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await departmentService.search({
                populate: '*',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[departmentName][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
