import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { DatePicker, DatePickerProps } from 'antd'

import { DATE_TIME_FORMAT } from '@/constants'

import FormField from '../FormField'

type FormDatePickerProps = DatePickerProps & {
    className?: React.ComponentProps<'div'>['className']
    label: string
    name: string
    placeholder?: string
    required?: boolean
}

export const FormDatePicker = ({
    name,
    className,
    label,
    required,
    size = 'large',
    ...props
}: FormDatePickerProps) => {
    const { control } = useFormContext()

    return (
        <FormField
            label={label}
            required={required}
            renderField={() => (
                <Controller
                    name={name}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <div className={`flex flex-col ${className ?? ''}`}>
                            <DatePicker
                                size={size}
                                status={error ? 'error' : ''}
                                variant="filled"
                                format={DATE_TIME_FORMAT.DATE_ONLY}
                                {...field}
                                {...props}
                                className="py-2.5"
                            />
                            <span className="text-xs text-red-500">
                                {error?.message}
                            </span>
                        </div>
                    )}
                />
            )}
        />
    )
}
