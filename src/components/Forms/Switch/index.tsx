import { Controller, useFormContext } from 'react-hook-form';

import { Switch, SwitchProps } from 'antd';

interface FormSwitchProps extends SwitchProps {
  name: string;
}

const FormSwitch = (props: FormSwitchProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field: { value, onChange, ref } }) => (
        <Switch checked={value} onChange={onChange} ref={ref} {...props} />
      )}
    />
  );
};

export default FormSwitch;
