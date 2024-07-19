import React, { useId } from 'react'

interface FormFieldProps {
  bodyClass?: string
  className?: string
  description?: string
  label?: React.ReactNode
  renderField?({ id }: { id: string }): React.JSX.Element
  required?: boolean
}

const FormField = (props: FormFieldProps) => {
  const id = useId()

  const { label, renderField, className, required, bodyClass, description } =
    props

  return (
    <div className={className ?? 'space-y-2'}>
      <label
        htmlFor={id}
        className="flex items-center font-bold text-[15px] w-max">
        {label}
        {required && <span className="text-red-500 ml-1 font-black"> *</span>}
        <span className="text-zinc-400 font-normal ml-1 text-sm">
          {description}
        </span>
      </label>
      <div className={bodyClass ?? 'w-full'}>{renderField?.({ id })}</div>
    </div>
  )
}

export default FormField
