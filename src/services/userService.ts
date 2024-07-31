import { API_URL } from '@/constants'
import { UserCreateRequestModel, UserModel } from '@/models'

import { axiosService } from './axiosService'

export const userService = {
    getInfo: (): Promise<UserModel> =>
        axiosService()<UserModel>({
            baseURL: API_URL.USER_INFO,
            method: 'GET',
            params: {
                populate: 'deep,4',
            },
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            }),
    create: (data: UserCreateRequestModel): Promise<UserModel> =>
        axiosService()<UserModel>({
            url: 'users',
            method: 'POST',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            }),
}
