import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input/TextArea';

const { TextArea } = Input;

interface FormTextAreaProps extends TextAreaProps {
  name: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  showNumberOfCharacter?: boolean;
}

const FormTextArea = (props: FormTextAreaProps) => {
  const { name, rules } = props;

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div>
          <TextArea
            {...field}
            status={error ? 'error' : ''}
            {...props}
            className={`${props?.className} text-area-input `}
          />
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-danger text-xs">{error?.message}</span>
            {props?.showNumberOfCharacter && (
              <span className="text-xs text-zinc-500">
                {field?.value?.length || 0}/{props?.maxLength || 0}
              </span>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default FormTextArea;
