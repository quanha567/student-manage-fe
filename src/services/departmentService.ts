import { API_URL } from '@/constants'
import { DepartmentModel, DepartmentRequestModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type DepartmentCreateResponse = CreateResponse<DepartmentModel>
export type DepartmentListResponse = ListResponse<DepartmentModel>
export type DepartmentDetailResponse = SingleMetaData<DepartmentModel>
export type DepartmentCreateRequest = CreateRequest<DepartmentRequestModel>

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
    get: (id: number): Promise<DepartmentDetailResponse> => {
        return axiosService()<DepartmentDetailResponse>({
            url: API_URL.departmentWithId(id),
            method: 'GET',
            params: {
                populate: '*',
            },
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    create: (
        data: DepartmentCreateRequest,
    ): Promise<DepartmentCreateResponse> => {
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
        id: number,
        data: DepartmentCreateRequest,
    ): Promise<DepartmentCreateResponse> => {
        return axiosService()<DepartmentCreateResponse>({
            url: API_URL.departmentWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<DepartmentDetailResponse> => {
        return axiosService()<DepartmentDetailResponse>({
            url: API_URL.departmentWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
