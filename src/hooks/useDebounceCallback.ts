import React, { useCallback, useRef } from 'react'

export const useDebounce = (
    callback: (...args: unknown[]) => void,
    delay: number,
) => {
    const callbackRef = React.useRef(callback)
    const timer = useRef<number>()

    React.useLayoutEffect(() => {
        callbackRef.current = callback
    })

    const naiveDebounce = useCallback(
        (
            func: (...args: unknown[]) => void,
            delayMs: number,
            ...args: unknown[]
        ) => {
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
                naiveDebounce(callbackRef.current, delay, ...args)
            },
        [delay, naiveDebounce],
    )
}
