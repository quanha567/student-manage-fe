import { API_URL } from '@/constants'
import { SyllabusCreateModel, SyllabusModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type SyllabusCreateResponse = CreateResponse<SyllabusModel>
export type SyllabusListResponse = ListResponse<SyllabusModel>
export type SyllabusDetailResponse = SingleMetaData<SyllabusModel>
export type SyllabusCreateRequest = CreateRequest<SyllabusCreateModel>

export const syllabusService = {
    search: (params?: SearchParams): Promise<SyllabusListResponse> => {
        return axiosService()<SyllabusListResponse>({
            url: API_URL.SYLLABUS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<SyllabusDetailResponse> => {
        return axiosService()<SyllabusDetailResponse>({
            url: API_URL.syllabusWithId(id),
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
    create: (data: SyllabusCreateRequest): Promise<SyllabusCreateResponse> => {
        return axiosService()<SyllabusCreateResponse>({
            url: API_URL.SYLLABUS,
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
        data: SyllabusCreateRequest,
    ): Promise<SyllabusCreateResponse> => {
        return axiosService()<SyllabusCreateResponse>({
            url: API_URL.syllabusWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<SyllabusDetailResponse> => {
        return axiosService()<SyllabusDetailResponse>({
            url: API_URL.syllabusWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
