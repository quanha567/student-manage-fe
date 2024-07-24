import { API_URL } from '@/constants'
import { UserModel } from '@/models'

import { axiosService } from './axiosService'

export const userService = {
    getInfo: (): Promise<UserModel> =>
        axiosService()<UserModel>({
            baseURL: API_URL.USER_INFO,
            method: 'GET',
            params: {
                populate: '*',
            },
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            }),
}
