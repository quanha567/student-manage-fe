import { API_URL } from '@/constants'
import { AcademicYearModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type AcademicYearCreateResponse = CreateResponse<AcademicYearModel>
export type AcademicYearListResponse = ListResponse<AcademicYearModel>
export type AcademicYearDetailResponse = SingleMetaData<AcademicYearModel>
export type AcademicYearCreateRequest = CreateRequest<AcademicYearModel>

export const academicYearService = {
    search: (params?: SearchParams): Promise<AcademicYearListResponse> => {
        return axiosService()<AcademicYearListResponse>({
            url: API_URL.ACADEMIC_YEAR,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<AcademicYearDetailResponse> => {
        return axiosService()<AcademicYearDetailResponse>({
            url: API_URL.academicYearWithId(id),
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
        data: AcademicYearCreateRequest,
    ): Promise<AcademicYearCreateResponse> => {
        return axiosService()<AcademicYearCreateResponse>({
            url: API_URL.ACADEMIC_YEAR,
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
        data: AcademicYearCreateRequest,
    ): Promise<AcademicYearCreateResponse> => {
        return axiosService()<AcademicYearCreateResponse>({
            url: API_URL.academicYearWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<AcademicYearDetailResponse> => {
        return axiosService()<AcademicYearDetailResponse>({
            url: API_URL.academicYearWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
