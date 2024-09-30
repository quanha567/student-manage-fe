import { API_URL } from '@/constants'
import { ExamCreateRequestModel, ExamModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type ExamCreateResponse = CreateResponse<ExamModel>
export type ExamListResponse = ListResponse<ExamModel>
export type ExamDetailResponse = SingleMetaData<ExamModel>
export type ExamCreateRequest = CreateRequest<ExamCreateRequestModel>

export const examService = {
    search: (params?: SearchParams): Promise<ExamListResponse> => {
        return axiosService()<ExamListResponse>({
            url: API_URL.EXAMS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<ExamDetailResponse> => {
        return axiosService()<ExamDetailResponse>({
            url: API_URL.examWithId(id),
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
    create: (data: ExamCreateRequest): Promise<ExamCreateResponse> => {
        return axiosService()<ExamCreateResponse>({
            url: API_URL.EXAMS,
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
        data: ExamCreateRequest,
    ): Promise<ExamCreateResponse> => {
        return axiosService()<ExamCreateResponse>({
            url: API_URL.examWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<ExamDetailResponse> => {
        return axiosService()<ExamDetailResponse>({
            url: API_URL.examWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
