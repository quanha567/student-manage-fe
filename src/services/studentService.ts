import fileDownload from 'js-file-download'

import { API_URL } from '@/constants'
import { StudentModel, StudentRequestModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type StudentCreateResponse = CreateResponse<StudentModel>
export type StudentListResponse = ListResponse<StudentModel>
export type StudentDetailResponse = SingleMetaData<StudentModel>
export type StudentCreateRequest = CreateRequest<StudentRequestModel>

export const studentService = {
    search: (params?: SearchParams): Promise<StudentListResponse> => {
        return axiosService()<StudentListResponse>({
            url: API_URL.STUDENTS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<StudentDetailResponse> => {
        return axiosService()<StudentDetailResponse>({
            url: API_URL.studentWithId(id),
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
    create: (data: StudentCreateRequest): Promise<StudentCreateResponse> => {
        return axiosService()<StudentCreateResponse>({
            url: API_URL.STUDENTS,
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
        data: StudentCreateRequest,
    ): Promise<StudentCreateResponse> => {
        return axiosService()<StudentCreateResponse>({
            url: API_URL.studentWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<StudentDetailResponse> => {
        return axiosService()<StudentDetailResponse>({
            url: API_URL.studentWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    downloadExampleFile: (): Promise<Blob> => {
        return axiosService()<Blob>({
            url: API_URL.STUDENT_DOWNLOAD_FILE,
            method: 'GET',
            responseType: 'blob',
        })
            .then((res) => {
                fileDownload(res.data, 'student-import-example.xlsx')
                return res.data
            })
            .catch((err: unknown) => {
                throw err
            })
    },
    getMyScore: (id: number): Promise<Blob> => {
        return axiosService()<Blob>({
            url: API_URL.getMyScore(id),
            method: 'GET',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    importFile: (data: FormData): Promise<string> => {
        return axiosService()<string>({
            url: API_URL.STUDENT_IMPORT_FILE,
            method: 'POST',
            data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
