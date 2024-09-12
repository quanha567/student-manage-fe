import { API_URL } from '@/constants'
import { SemesterCreateRequestModel, SemesterModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type SemesterCreateResponse = CreateResponse<SemesterModel>
export type SemesterListResponse = ListResponse<SemesterModel>
export type SemesterDetailResponse = SingleMetaData<SemesterModel>
export type SemesterCreateRequest = CreateRequest<SemesterCreateRequestModel>

export const semesterService = {
    search: (params?: SearchParams): Promise<SemesterListResponse> => {
        return axiosService()<SemesterListResponse>({
            url: API_URL.SEMESTERS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<SemesterDetailResponse> => {
        return axiosService()<SemesterDetailResponse>({
            url: API_URL.semesterWithId(id),
            method: 'GET',
            params: {
                populate: 'deep,4',
            },
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    create: (data: SemesterCreateRequest): Promise<SemesterCreateResponse> => {
        return axiosService()<SemesterCreateResponse>({
            url: API_URL.SEMESTERS,
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
        data: SemesterCreateRequest,
    ): Promise<SemesterCreateResponse> => {
        return axiosService()<SemesterCreateResponse>({
            url: API_URL.semesterWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<SemesterDetailResponse> => {
        return axiosService()<SemesterDetailResponse>({
            url: API_URL.semesterWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
