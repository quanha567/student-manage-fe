import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { HttpStatusCode, isAxiosError } from 'axios'

import { App } from 'antd'

import { LOCAL_STORAGES, PAGE_PATHS } from '@/constants'
import { useAppDispatch } from '@/hooks'
import { LoginRequestModel } from '@/models'
import { setUser } from '@/redux'
import { authService, userService } from '@/services'

const formDefaultValues: LoginRequestModel = {
    identifier: 'admin',
    password: '123456',
}

export const useFormLogin = () => {
    const navigate = useNavigate()

    const { notification } = App.useApp()
    const dispatch = useAppDispatch()

    const formMethods = useForm<LoginRequestModel>({
        defaultValues: formDefaultValues,
    })

    const { handleSubmit } = formMethods

    const handleLogin = useCallback(
        async (data: LoginRequestModel) => {
            try {
                const { jwt } = await authService.login(data)

                localStorage.setItem(LOCAL_STORAGES.ACCESS_TOKEN, jwt)

                const userInfo = await userService.getInfo()

                dispatch(setUser(userInfo))
                navigate(PAGE_PATHS.DASHBOARD)
                notification.success({
                    message: 'Đăng nhập thành công!',
                    description: `Xin chào ${userInfo.student?.fullName ?? ''}! Chào mừng bạn trở lại.`,
                })
            } catch (err: unknown) {
                console.log('err', err)

                notification.error({
                    message:
                        isAxiosError(err) &&
                        err.status === HttpStatusCode.BadRequest
                            ? 'Tên tài khoản hoặc mật khẩu không đúng!'
                            : 'Có lỗi xảy ra vui lòng thử lại sau!',
                })
            }
        },
        [notification, navigate, dispatch],
    )

    return {
        ...formMethods,
        login: handleSubmit(handleLogin),
    } as const
}
