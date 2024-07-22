import { API_URL } from '@/constants'
import { DepartmentModel } from '@/models'
import { CreateResponse, ListResponse, SearchParams } from '@/types'

import { axiosService } from './axiosService'

type DepartmentListResponse = ListResponse<DepartmentModel>
type DepartmentCreateResponse = CreateResponse<DepartmentModel>

export const departmentService = {
    search: (params?: SearchParams): Promise<DepartmentListResponse> => {
        return axiosService()<DepartmentListResponse>({
            url: API_URL.DEPARTMENTS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    create: (data: DepartmentModel): Promise<DepartmentCreateResponse> => {
        return axiosService()<DepartmentCreateResponse>({
            url: API_URL.DEPARTMENTS,
            method: 'POST',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    update: (
        id: string,
        data: DepartmentModel,
    ): Promise<DepartmentCreateResponse> => {
        return axiosService()<DepartmentCreateResponse>({
            url: `${API_URL.DEPARTMENTS}/${id}`,
            method: 'POST',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
