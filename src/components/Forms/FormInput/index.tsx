import { Controller, useFormContext } from 'react-hook-form'

import { twMerge } from 'tailwind-merge'

import { Input, InputProps } from 'antd'

import FormField from '../FormField'

type FormInputProps = InputProps & {
    label: string
    name: string
    required?: boolean
}

export const FormInput = ({
    name,
    label,
    required,
    ...restProps
}: FormInputProps) => {
    const { control } = useFormContext()

    return (
        <FormField
            label={label}
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
                                    classNames={{
                                        input: twMerge(
                                            'placeholder:text-zinc-600 focus:placeholder:text-zinc-400',
                                            restProps.classNames?.input,
                                        ),
                                    }}
                                />
                            ) : (
                                <Input
                                    status={error ? 'error' : ''}
                                    variant="filled"
                                    size="large"
                                    {...field}
                                    {...restProps}
                                    className={twMerge(
                                        'px-4 py-2.5 placeholder:text-zinc-600 focus:placeholder:text-zinc-400',
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
