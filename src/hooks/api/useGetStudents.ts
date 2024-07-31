import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { StudentListResponse, studentService } from '@/services'

interface GetStudentParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetStudents = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetStudentParams) => {
    return useQuery<StudentListResponse, Error, StudentListResponse>({
        queryKey: [
            QUERY_KEYS.STUDENT_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await studentService.search({
                populate: '*',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[fullName][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
