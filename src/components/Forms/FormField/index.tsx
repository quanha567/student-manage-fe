import React, { useId } from 'react'

interface FormFieldProps {
    bodyClass?: string
    className?: string
    description?: string
    label?: React.ReactNode
    renderField?: ({ id }: { id: string }) => React.JSX.Element
    required?: boolean
}

const FormField = (props: FormFieldProps) => {
    const id = useId()

    const { label, renderField, className, required, bodyClass, description } =
        props

    return (
        <div className={className ?? (label ? 'space-y-2' : '')}>
            <label
                htmlFor={id}
                className="flex w-max items-center text-[15px] font-bold"
            >
                {label}
                {required && (
                    <span className="ml-1 font-black text-red-500"> *</span>
                )}
                <span className="ml-1 text-sm font-normal text-zinc-400">
                    {description}
                </span>
            </label>
            <div className={bodyClass ?? 'w-full'}>{renderField?.({ id })}</div>
        </div>
    )
}

export default FormField
