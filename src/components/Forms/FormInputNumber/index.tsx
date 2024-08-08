import { Controller, useFormContext } from 'react-hook-form'

import { twMerge } from 'tailwind-merge'

import { InputNumber, InputNumberProps } from 'antd'

import FormField from '../FormField'

type FormInputNumberProps = InputNumberProps & {
    label: string
    name: string
    required?: boolean
}

export const FormInputNumber = ({
    name,
    label,
    required,
    ...restProps
}: FormInputNumberProps) => {
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
                            <InputNumber
                                status={error ? 'error' : ''}
                                variant="filled"
                                size="large"
                                {...field}
                                {...restProps}
                                controls={false}
                                className={twMerge(
                                    'w-full px-1 py-[3px]',
                                    restProps.className,
                                )}
                            />
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
