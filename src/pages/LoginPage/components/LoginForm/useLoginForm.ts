import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { yupResolver } from '@hookform/resolvers/yup'
import { HttpStatusCode, isAxiosError } from 'axios'
import { ObjectSchema, object, string } from 'yup'

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

const formLoginValidate: ObjectSchema<LoginRequestModel> = object().shape({
    identifier: string().required('Vui lòng nhập tên tài khoản!'),
    password: string().required('Vui lòng nhập mật khẩu của bạn!'),
})

export const useFormLogin = () => {
    const navigate = useNavigate()

    const { notification } = App.useApp()
    const dispatch = useAppDispatch()

    const formMethods = useForm<LoginRequestModel>({
        defaultValues: formDefaultValues,
        resolver: yupResolver(formLoginValidate),
    })

    const {
        handleSubmit,
        formState: { isSubmitting },
        getValues,
        setFocus,
    } = formMethods

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

    useEffect(() => {
        const handleCatchEventKeyEnter = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !isSubmitting) {
                const formData = getValues()

                if (formData.identifier && formData.password) {
                    void handleSubmit(handleLogin)()

                    return
                }

                setFocus(!formData.identifier ? 'identifier' : 'password')
            }
        }

        window.addEventListener('keydown', handleCatchEventKeyEnter)

        return () => {
            window.removeEventListener('keydown', handleCatchEventKeyEnter)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        ...formMethods,
        login: handleSubmit(handleLogin),
    } as const
}
