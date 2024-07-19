import React from 'react'
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'

import { DatePicker as DatePickerAntd } from 'antd'

interface DatePickerProps {
  className?: React.ComponentProps<'div'>['className']
  disableDateBeforeToday?: boolean
  name: string
  placeholder?: string
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined
}

const DatePicker = (props: DatePickerProps) => {
  const { name, rules, className = '' } = props

  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className={`flex flex-col ${className}`}>
          <DatePickerAntd
            {...field}
            {...props}
            status={error ? 'error' : ''}
            // disabledDate={current => {
            //   const customDate = moment().format('YYYY-MM-DD')

            //   return (
            //     current &&
            //     current < moment(customDate, 'YYYY-MM-DD') &&
            //     disableDateBeforeToday
            //   )
            // }}
          />
          <span className="text-xs text-danger">{error?.message}</span>
        </div>
      )}
    />
  )
}

export default DatePicker
