import { API_URL } from '@/constants'
import { ClassModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type ClassCreateResponse = CreateResponse<ClassModel>
export type ClassListResponse = ListResponse<ClassModel>
export type ClassDetailResponse = SingleMetaData<ClassModel>
export type ClassCreateRequest = CreateRequest<ClassModel>

export const classService = {
    search: (params?: SearchParams): Promise<ClassListResponse> => {
        return axiosService()<ClassListResponse>({
            url: API_URL.CLASSES,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<ClassDetailResponse> => {
        return axiosService()<ClassDetailResponse>({
            url: API_URL.classWithId(id),
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
    create: (data: ClassCreateRequest): Promise<ClassCreateResponse> => {
        return axiosService()<ClassCreateResponse>({
            url: API_URL.CLASSES,
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
        data: ClassCreateRequest,
    ): Promise<ClassCreateResponse> => {
        return axiosService()<ClassCreateResponse>({
            url: API_URL.classWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<ClassDetailResponse> => {
        return axiosService()<ClassDetailResponse>({
            url: API_URL.classWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
