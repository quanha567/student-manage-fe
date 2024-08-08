import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { TeacherListResponse, teacherService } from '@/services'

interface GetTeacherParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetTeachers = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetTeacherParams) => {
    return useQuery<TeacherListResponse, Error, TeacherListResponse>({
        queryKey: [
            QUERY_KEYS.TEACHER_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await teacherService.search({
                populate: '*',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[fullName][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
