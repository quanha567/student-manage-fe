import { FormProvider } from 'react-hook-form'

import { Button, FormInput } from '@/components'

import { useFormLogin } from './useLoginForm'

export const LoginForm = () => {
    const { login, ...formMethods } = useFormLogin()

    return (
        <FormProvider {...formMethods}>
            <div className="mt-6 space-y-4">
                <FormInput
                    label="Tài khoản"
                    name="identifier"
                    placeholder="Email hoặc số điện thoại"
                />
                <FormInput
                    label="Mật khẩu"
                    name="password"
                    placeholder="Nhập mật khẩu"
                />
                <Button
                    onClick={login}
                    className="w-full"
                    loading={formMethods.formState.isSubmitting}
                >
                    Đăng nhập
                </Button>
            </div>
        </FormProvider>
    )
}
