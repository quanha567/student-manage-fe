import React, { useCallback, useRef } from 'react'

export const useDebounce = (
    callback: (...args: unknown[]) => void,
    delay: number,
) => {
    const callbackRef = React.useRef(callback)
    const timer = useRef<NodeJS.Timeout>()

    React.useLayoutEffect(() => {
        callbackRef.current = callback
    })

    const nativeDebounce = useCallback(
        (
            func: (...args: unknown[]) => void,
            delayMs: number,
            ...args: unknown[]
        ) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                func(...args)
            }, delayMs)
        },
        [],
    )

    return React.useMemo(
        () =>
            (...args: unknown[]) => {
                nativeDebounce(callbackRef.current, delay, ...args)
            },
        [delay, nativeDebounce],
    )
}
