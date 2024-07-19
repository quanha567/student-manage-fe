import React from 'react';

import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

import { Radio, RadioProps } from 'antd';

interface FormRadioProps extends RadioProps {
  name: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  children?: React.ReactNode;
}

const FormRadio = (props: FormRadioProps) => {
  const { name, rules, children } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <Radio.Group {...field} {...props}>
            {children}
          </Radio.Group>
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

export default FormRadio;
