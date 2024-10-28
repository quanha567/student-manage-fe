import { API_URL } from '@/constants'
import {
    SectionCreateRequestModel,
    SectionModel,
    SectionPointResponse,
} from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type SectionCreateResponse = CreateResponse<SectionModel>
export type SectionListResponse = ListResponse<SectionModel>
export type SectionDetailResponse = SingleMetaData<SectionModel>
export type SectionCreateRequest = CreateRequest<SectionCreateRequestModel>

export const sectionService = {
    search: (params?: SearchParams): Promise<SectionListResponse> => {
        return axiosService()<SectionListResponse>({
            url: API_URL.SECTIONS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<SectionDetailResponse> => {
        return axiosService()<SectionDetailResponse>({
            url: API_URL.sectionWithId(id),
            method: 'GET',
            params: {
                populate: 'deep',
            },
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    create: (data: SectionCreateRequest): Promise<SectionCreateResponse> => {
        return axiosService()<SectionCreateResponse>({
            url: API_URL.SECTIONS,
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
        data: SectionCreateRequest,
    ): Promise<SectionCreateResponse> => {
        return axiosService()<SectionCreateResponse>({
            url: API_URL.sectionWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<SectionDetailResponse> => {
        return axiosService()<SectionDetailResponse>({
            url: API_URL.sectionWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    getSectionDetail: (id: number): Promise<SectionPointResponse> => {
        return axiosService()<SectionPointResponse>({
            url: API_URL.sectionDetail(id),
            method: 'GET',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    importScore: (
        data: SectionPointResponse,
        id: number,
    ): Promise<SectionCreateResponse> => {
        return axiosService()<SectionCreateResponse>({
            url: API_URL.importScore(id),
            method: 'POST',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
