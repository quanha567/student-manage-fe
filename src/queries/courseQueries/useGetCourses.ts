import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { CourseListResponse, courseService } from '@/services'

interface GetCourseParams {
    asc?: string
    pageIndex: number
    pageSize: number
    searchText?: string
    sortBy?: string
}

export const useGetCourses = ({
    asc,
    pageIndex,
    pageSize,
    searchText,
    sortBy,
}: GetCourseParams) => {
    return useQuery<CourseListResponse, Error, CourseListResponse>({
        queryKey: [
            QUERY_KEYS.COURSE_LIST,
            pageIndex,
            pageSize,
            sortBy,
            asc,
            searchText,
        ],
        queryFn: async () =>
            await courseService.search({
                populate: 'deep',
                'pagination[page]': pageIndex,
                'pagination[pageSize]': pageSize,
                'filters[name][$containsi]': searchText ?? '',
                'sort[0]': `${String(sortBy)}:${asc === 'ascend' ? 'asc' : 'desc'}`,
            }),
    })
}
