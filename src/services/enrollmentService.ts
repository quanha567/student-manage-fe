import { API_URL } from '@/constants'
import { EnrollmentCreateModel, EnrollmentModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type EnrollmentCreateResponse = CreateResponse<EnrollmentModel>
export type EnrollmentListResponse = ListResponse<EnrollmentModel>
export type EnrollmentDetailResponse = SingleMetaData<EnrollmentModel>
export type EnrollmentCreateRequest = CreateRequest<EnrollmentCreateModel>

export const enrollmentService = {
    search: (params?: SearchParams): Promise<EnrollmentListResponse> => {
        return axiosService()<EnrollmentListResponse>({
            url: API_URL.ENROLLMENTS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<EnrollmentDetailResponse> => {
        return axiosService()<EnrollmentDetailResponse>({
            url: API_URL.enrollmentWithId(id),
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
        data: EnrollmentCreateRequest,
    ): Promise<EnrollmentCreateResponse> => {
        return axiosService()<EnrollmentCreateResponse>({
            url: API_URL.ENROLLMENTS,
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
        data: EnrollmentCreateRequest,
    ): Promise<EnrollmentCreateResponse> => {
        return axiosService()<EnrollmentCreateResponse>({
            url: API_URL.enrollmentWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<EnrollmentDetailResponse> => {
        return axiosService()<EnrollmentDetailResponse>({
            url: API_URL.enrollmentWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
