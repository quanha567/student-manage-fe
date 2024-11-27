import { API_URL } from '@/constants'
import { RoomModel } from '@/models'
import {
    CreateRequest,
    CreateResponse,
    ListResponse,
    SearchParams,
    SingleMetaData,
} from '@/types'

import { axiosService } from './axiosService'

type RoomCreateResponse = CreateResponse<RoomModel>
export type RoomListResponse = ListResponse<RoomModel>
export type RoomDetailResponse = SingleMetaData<RoomModel>
export type RoomCreateRequest = CreateRequest<RoomModel>

export const roomService = {
    search: (params?: SearchParams): Promise<RoomListResponse> => {
        return axiosService()<RoomListResponse>({
            url: API_URL.ROOMS,
            method: 'GET',
            params,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    get: (id: number): Promise<RoomDetailResponse> => {
        return axiosService()<RoomDetailResponse>({
            url: API_URL.roomWithId(id),
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
    create: (data: RoomCreateRequest): Promise<RoomCreateResponse> => {
        return axiosService()<RoomCreateResponse>({
            url: API_URL.ROOMS,
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
        data: RoomCreateRequest,
    ): Promise<RoomCreateResponse> => {
        return axiosService()<RoomCreateResponse>({
            url: API_URL.roomWithId(id),
            method: 'PUT',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    delete: (id: number): Promise<RoomDetailResponse> => {
        return axiosService()<RoomDetailResponse>({
            url: API_URL.roomWithId(id),
            method: 'DELETE',
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
