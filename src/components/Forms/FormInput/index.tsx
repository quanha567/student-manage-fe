import { Controller, useFormContext } from 'react-hook-form'

import { twMerge } from 'tailwind-merge'

import { Input, InputProps } from 'antd'

import FormField from '../FormField'

type FormInputProps = InputProps & {
    label?: string
    name: string
    required?: boolean
    wrapperClassName?: string
}

export const FormInput = ({
    name,
    label,
    required,
    wrapperClassName,
    ...restProps
}: FormInputProps) => {
    const { control } = useFormContext()

    return (
        <FormField
            label={label}
            className={wrapperClassName}
            required={required}
            renderField={() => (
                <Controller
                    control={control}
                    name={name}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            {name === 'password' ||
                            name === 'confirmPassword' ||
                            name === 'confirmPw' ||
                            restProps.type === 'password' ? (
                                <Input.Password
                                    variant="filled"
                                    size="large"
                                    id="input-password"
                                    status={error ? 'error' : ''}
                                    {...field}
                                    {...restProps}
                                    className="px-4 py-2.5"
                                />
                            ) : (
                                <Input
                                    status={error ? 'error' : ''}
                                    variant="filled"
                                    size="large"
                                    {...field}
                                    {...restProps}
                                    className={twMerge(
                                        'px-4 py-2.5',
                                        restProps.className,
                                    )}
                                />
                            )}
                            <span className="pl-2 text-xs text-red-500">
                                {error?.message}
                            </span>
                        </div>
                    )}
                />
            )}
        />
    )
}
