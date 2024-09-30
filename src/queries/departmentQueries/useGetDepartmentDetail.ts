import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { DepartmentDetailResponse, departmentService } from '@/services'

export const useGetDepartmentDetail = (id?: number) => {
    return useQuery<DepartmentDetailResponse, Error, DepartmentDetailResponse>({
        queryKey: [QUERY_KEYS.DEPARTMENT, id],
        enabled: Boolean(id),
        queryFn: () => departmentService.get(Number(id)),
    })
}
