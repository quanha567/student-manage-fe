import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'

import { Checkbox, CheckboxProps } from 'antd'

interface FormCheckBoxProps extends CheckboxProps {
  label?: string
  name: string
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined
}

const FormCheckBox = (props: FormCheckBoxProps) => {
  const { name, rules, label } = props

  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <div>
          <Checkbox
            ref={ref}
            checked={Boolean(value)}
            onChange={onChange}
            {...props}>
            {label}
          </Checkbox>
          <span className="text-danger text-xs">{error?.message}</span>
        </div>
      )}
    />
  )
}

export default FormCheckBox
