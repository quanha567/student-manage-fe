import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { CourseDetailResponse, courseService } from '@/services'

export const useGetCourseDetail = (id?: number) => {
    return useQuery<CourseDetailResponse, Error, CourseDetailResponse>({
        queryKey: [QUERY_KEYS.COURSE, id],
        enabled: Boolean(id),
        queryFn: () => courseService.get(Number(id)),
    })
}
