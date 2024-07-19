import React from 'react';

import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

import { Select, SelectProps } from 'antd';

interface FormSelectProps extends SelectProps {
  name: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  children?: React.ReactNode;
  singleTags?: boolean;
}

const FormSelect = (props: FormSelectProps) => {
  const { name, rules, children } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <Select {...field} {...props} status={error ? 'error' : ''}>
            {children}
          </Select>
          {error?.message && (
            <span className="text-danger text-xs mt-2 block">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default FormSelect;
