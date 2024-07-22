import axios, { AxiosInstance, HttpStatusCode, isAxiosError } from 'axios'

import { ENV_CONFIGS } from '@/configs'
import { LOCAL_STORAGES, PAGE_PATHS } from '@/constants'

export const axiosService = (): AxiosInstance => {
    const accessToken = localStorage.getItem(LOCAL_STORAGES.ACCESS_TOKEN) ?? ''

    const handleLogout = () => {
        localStorage.removeItem(LOCAL_STORAGES.ACCESS_TOKEN)
    }

    const axiosOptions = axios.create({
        baseURL: ENV_CONFIGS.BASE_URL,
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
        },
    })

    // Truoc khi gui server
    axiosOptions.interceptors.request.use(
        config => {
            return config
        },

        error => {
            throw error
        },
    )
    // Sau khi gui server
    axiosOptions.interceptors.response.use(
        response => {
            return response
        },
        errors => {
            if (
                isAxiosError(errors) &&
                errors.status === HttpStatusCode.Unauthorized
            ) {
                handleLogout()
                window.location.replace(PAGE_PATHS.LOGIN)
            } else {
                throw errors
            }
        },
    )

    return axiosOptions
}
