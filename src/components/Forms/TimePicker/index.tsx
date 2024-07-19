import React from 'react';

import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

import { TimePicker as TimePickerAntd } from 'antd';

interface TimePickerProps {
  name: string;
  placeholder?: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  [key: string]: any;
  className?: React.ComponentProps<'div'>['className'];
}

const TimePicker = (props: TimePickerProps) => {
  const { name, rules, className } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className={`flex flex-col ${className}`}>
          <TimePickerAntd {...field} {...props} status={error ? 'error' : ''} />
          <span className="text-xs text-danger">{error?.message}</span>
        </div>
      )}
    />
  );
};

export default TimePicker;
