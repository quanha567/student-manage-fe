import { twMerge } from 'tailwind-merge'

import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd'
type ButtonProps = AntdButtonProps

export const Button = ({
    type = 'primary',
    className,
    ...restProps
}: ButtonProps) => {
    return (
        <AntdButton
            size="middle"
            type="primary"
            {...restProps}
            className={twMerge(
                'font-bold',
                type === 'primary' ? 'drop-shadow-primary drop-shadow' : '',
                className,
            )}
        />
    )
}
