import { twMerge } from 'tailwind-merge'

import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd'
type ButtonProps = AntdButtonProps

export const Button = (props: ButtonProps) => {
    return (
        <AntdButton
            size="large"
            type="primary"
            {...props}
            className={twMerge('py-[22px] font-bold', props.className)}
        />
    )
}
