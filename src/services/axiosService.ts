import { toast } from 'react-hot-toast'

import axios from 'axios'
import { PATH_NAME } from '~/constants/router'

import { LOCAL_STORAGE } from '../constants/localStorage'
import { checkTokenExp } from '../utils/tokenUtils'
import authService from './authService'

// closure: to save the refreshTokenRequest
let refreshTokenRequest: any = null

const axiosService = () => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) || ''

  const refreshToken = localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN) || ''

  const organizationId =
    localStorage.getItem(LOCAL_STORAGE.ORGANIZATION_ID) || ''

  const loadRefreshToken = async () => {
    try {
      const response = await authService.refreshToken(refreshToken)

      return response
    } catch (error) {
      console.log('error when call refresh token: ', error)
      throw error
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE.ORGANIZATION_ID)
  }

  const axiosOptions = axios.create({
    baseURL: import.meta.env.API_URL,
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  })

  // Truoc khi gui server
  axiosOptions.interceptors.request.use(
    async (config: any) => {
      // config.params = {
      //   ...config.params,
      //   organizationId,
      // };
      if (!checkTokenExp(accessToken) || !organizationId) {
        refreshTokenRequest = refreshTokenRequest
          ? refreshTokenRequest
          : loadRefreshToken()
        try {
          const response = await refreshTokenRequest

          if (response) {
            localStorage.setItem(
              LOCAL_STORAGE.ACCESS_TOKEN,
              response.accessToken,
            )
            localStorage.setItem(
              LOCAL_STORAGE.REFRESH_TOKEN,
              response.refreshToken,
            )
            localStorage.setItem(
              LOCAL_STORAGE.ORGANIZATION_ID,
              response.organizationId,
            )
            config.headers = {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + response.accessToken,
            }

            // reset token request for the next expiration
            refreshTokenRequest = null
          }
        } catch (error: any) {
          refreshTokenRequest = null
          if (!error.response) {
            toast.error('Không có kết nối đến server!')
          } else {
            if (error?.response?.status === 400) {
              // window.location.replace(PATH_NAME.LOGIN);
              handleLogout()
              toast.error('Phiên đăng nhập lỗi, vui lòng đăng nhập lại!')
            } else {
              toast.error('Lỗi phiên đăng nhập')
            }
          }
        }

        return config
      }

      return config
    },

    error => {
      Promise.reject(error)
    },
  )
  // Sau khi gui server
  axiosOptions.interceptors.response.use(
    response => {
      return response
    },
    errors => {
      if (errors?.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn', {})
        window.location.replace(PATH_NAME.LOGIN)
        handleLogout()
      } else {
        throw errors
      }
    },
  )

  return axiosOptions
}

export default axiosService
