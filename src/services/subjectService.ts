import { API_URL } from '@/constants'
import { SubjectCreateModel, SubjectModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type SubjectCreateResponse = CreateResponse<SubjectModel>
export type SubjectListResponse = ListResponse<SubjectModel>
export type SubjectDetailResponse = SingleMetaData<SubjectModel>
export type SubjectCreateRequest = CreateRequest<SubjectCreateModel>

export const subjectService = {
    search: (params?: SearchParams): Promise<SubjectListResponse> => {
        return axiosService()<SubjectListResponse>({
            url: API_URL.SUBJECTS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<SubjectDetailResponse> => {
        return axiosService()<SubjectDetailResponse>({
            url: API_URL.subjectWithId(id),
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
    create: (data: SubjectCreateRequest): Promise<SubjectCreateResponse> => {
        return axiosService()<SubjectCreateResponse>({
            url: API_URL.SUBJECTS,
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
        data: SubjectCreateRequest,
    ): Promise<SubjectCreateResponse> => {
        return axiosService()<SubjectCreateResponse>({
            url: API_URL.subjectWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<SubjectDetailResponse> => {
        return axiosService()<SubjectDetailResponse>({
            url: API_URL.subjectWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
