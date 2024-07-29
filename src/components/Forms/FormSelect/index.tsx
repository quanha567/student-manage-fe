import { Controller, useFormContext } from 'react-hook-form'

import { twMerge } from 'tailwind-merge'

import { Select, SelectProps } from 'antd'

import FormField from '../FormField'

type FormSelectProps = SelectProps & {
    label: string
    name: string
    required?: boolean
}

export const FormSelect = ({
    name,
    label,
    required,
    ...restProps
}: FormSelectProps) => {
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
                        <>
                            <Select
                                {...field}
                                size="large"
                                filterOption={false}
                                maxTagTextLength={20}
                                maxTagCount="responsive"
                                variant="filled"
                                {...restProps}
                                status={error ? 'error' : ''}
                                className={twMerge(
                                    'h-full w-full',
                                    restProps.className,
                                )}
                                style={{
                                    height: 46,
                                }}
                            />
                            <span className="pl-2 text-xs text-red-500">
                                {error?.message}
                            </span>
                        </>
                    )}
                />
            )}
        />
    )
}
