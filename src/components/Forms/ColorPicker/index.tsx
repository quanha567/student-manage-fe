import { Controller, useFormContext } from 'react-hook-form'

import { ColorPicker } from 'antd'

interface FormColorPickerProps {
  name: string
  text?: string
}

const FormColorPicker = ({ name, text }: FormColorPickerProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <ColorPicker
          className="color-picker"
          value={String(value || '')}
          onChange={color => {
            onChange(color.toHexString())
          }}
          showText={color => (
            <span>
              {text}{' '}
              <span className="font-medium uppercase">
                ({color.toHexString()})
              </span>
            </span>
          )}
        />
      )}
    />
  )
}

export default FormColorPicker
