import { API_URL } from '@/constants'
import { TeacherModel, TeacherRequestModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'
import { TimetableModel } from '@/models/timetableModel'

type TeacherCreateResponse = CreateResponse<TeacherModel>
export type TeacherListResponse = ListResponse<TeacherModel>
export type TeacherDetailResponse = SingleMetaData<TeacherModel>
export type TeacherCreateRequest = CreateRequest<TeacherRequestModel>

export const teacherService = {
    search: (params?: SearchParams): Promise<TeacherListResponse> => {
        return axiosService()<TeacherListResponse>({
            url: API_URL.TEACHERS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<TeacherDetailResponse> => {
        return axiosService()<TeacherDetailResponse>({
            url: API_URL.teacherWithId(id),
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
    create: (data: TeacherCreateRequest): Promise<TeacherCreateResponse> => {
        return axiosService()<TeacherCreateResponse>({
            url: API_URL.TEACHERS,
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
        data: TeacherCreateRequest,
    ): Promise<TeacherCreateResponse> => {
        return axiosService()<TeacherCreateResponse>({
            url: API_URL.teacherWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<TeacherDetailResponse> => {
        return axiosService()<TeacherDetailResponse>({
            url: API_URL.teacherWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    getTimetable: (
        semester: string,
        teacherId: number,
    ): Promise<TimetableModel[]> => {
        return axiosService()<TimetableModel[]>({
            url: `teachers/${String(teacherId)}/schedule/${semester}`,
            method: 'GET',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
