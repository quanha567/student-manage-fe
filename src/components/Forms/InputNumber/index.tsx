import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

import { InputNumber, InputNumberProps } from 'antd';

interface FormInputProps extends InputNumberProps {
  name: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
}

const FormInputNumber = (props: FormInputProps) => {
  const { name, rules } = props;

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="">
          <InputNumber
            autoComplete="off"
            status={error ? 'error' : ''}
            controls={false}
            {...field}
            {...props}
          />
          <span className="text-danger text-xs block mt-1">
            {error?.message}
          </span>
        </div>
      )}
    />
  );
};

export default FormInputNumber;
