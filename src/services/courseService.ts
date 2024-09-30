import { API_URL } from '@/constants'
import { CourseCreateRequestModel, CourseModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type CourseCreateResponse = CreateResponse<CourseModel>
export type CourseListResponse = ListResponse<CourseModel>
export type CourseDetailResponse = SingleMetaData<CourseModel>
export type CourseCreateRequest = CreateRequest<CourseCreateRequestModel>

export const courseService = {
    search: (params?: SearchParams): Promise<CourseListResponse> => {
        return axiosService()<CourseListResponse>({
            url: API_URL.COURSES,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<CourseDetailResponse> => {
        return axiosService()<CourseDetailResponse>({
            url: API_URL.courseWithId(id),
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
    create: (data: CourseCreateRequest): Promise<CourseCreateResponse> => {
        return axiosService()<CourseCreateResponse>({
            url: API_URL.COURSES,
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
        data: CourseCreateRequest,
    ): Promise<CourseCreateResponse> => {
        return axiosService()<CourseCreateResponse>({
            url: API_URL.courseWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<CourseDetailResponse> => {
        return axiosService()<CourseDetailResponse>({
            url: API_URL.courseWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
