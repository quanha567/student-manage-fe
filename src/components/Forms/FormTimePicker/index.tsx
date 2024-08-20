import { Controller, useFormContext } from 'react-hook-form'

import { twMerge } from 'tailwind-merge'

import { TimePicker, TimePickerProps } from 'antd'

import FormField from '../FormField'

type FormTimePickerProps = TimePickerProps & {
    label?: string
    name: string
    required?: boolean
    wrapperClassName?: string
}

export const FormTimePicker = ({
    name,
    label,
    required,
    wrapperClassName,
    ...restProps
}: FormTimePickerProps) => {
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
                            <TimePicker
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
