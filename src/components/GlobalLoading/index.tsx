import {
    ReactNode,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState,
} from 'react'

import { Spin } from 'antd'

interface GlobalLoadingProps {
    children: ReactNode
}

export interface GlobalLoadingRef {
    close: () => void
    show: () => void
    toggle: () => void
}

export const GlobalLoading = forwardRef<GlobalLoadingRef, GlobalLoadingProps>(
    ({ children }, ref) => {
        const [isLoading, setIsLoading] = useState<boolean>(false)

        const toggle = useCallback(
            () => setIsLoading((prev) => !prev),
            [setIsLoading],
        )

        const close = useCallback(() => setIsLoading(false), [setIsLoading])
        const show = useCallback(() => setIsLoading(true), [setIsLoading])

        useImperativeHandle(
            ref,
            () => ({
                close,
                show,
                toggle,
            }),
            [show, close, toggle],
        )
        return (
            <Spin spinning={isLoading} size="large">
                {children}
            </Spin>
        )
    },
)
