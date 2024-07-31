import {
    Controller,
    FieldValues,
    RegisterOptions,
    useFormContext,
} from 'react-hook-form'

import { Input } from 'antd'
import { TextAreaProps } from 'antd/lib/input/TextArea'

import FormField from '../FormField'

const { TextArea } = Input

interface FormTextAreaProps extends TextAreaProps {
    label: string
    name: string
    required?: boolean
    rules?:
        | Omit<
              RegisterOptions<FieldValues, string>,
              'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
          >
        | undefined
    showNumberOfCharacter?: boolean
}

export const FormTextArea = ({
    name,
    rules,
    label,
    required,
    size = 'large',
    showNumberOfCharacter,
    ...restProps
}: FormTextAreaProps) => {
    const { control } = useFormContext()

    return (
        <FormField
            label={label}
            required={required}
            renderField={() => (
                <Controller
                    control={control}
                    name={name}
                    rules={rules}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            <TextArea
                                size={size}
                                status={error ? 'error' : ''}
                                {...field}
                                {...restProps}
                            />
                            <div className="mt-0.5 flex items-center justify-between">
                                <span className="text-danger text-xs">
                                    {error?.message}
                                </span>
                                {showNumberOfCharacter && (
                                    <span className="text-xs text-zinc-500">
                                        {field.value?.length || 0}/
                                        {restProps.maxLength ?? 0}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                />
            )}
        />
    )
}
