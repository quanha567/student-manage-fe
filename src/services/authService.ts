import axios from 'axios'

import { API_URL } from '@/constants'
import { LoginRequestModel, LoginResponseModel } from '@/models'

export const authService = {
    login: (data: LoginRequestModel): Promise<LoginResponseModel> =>
        axios<LoginResponseModel>({
            baseURL: API_URL.LOGIN,
            method: 'POST',
            data,
        })
            .then(res => res.data)
            .catch((err: unknown) => {
                throw err
            }),
}
