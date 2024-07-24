import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { LOCAL_STORAGES, PAGE_PATHS } from '@/constants'
import { useAppDispatch } from '@/hooks'
import { getUserInfo } from '@/redux'
import { isTokenExpired } from '@/utils'

interface AuthGuardProps {
    children: ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const [token, setToken] = useState<string>(
        localStorage.getItem(LOCAL_STORAGES.ACCESS_TOKEN) ?? '',
    )

    const dispatch = useAppDispatch()

    useEffect(() => {
        const handleTokenChange = (event: StorageEvent | CustomEvent) => {
            const storageEvent = event as StorageEvent
            if (
                storageEvent.key &&
                storageEvent.key !== String(LOCAL_STORAGES.ACCESS_TOKEN)
            ) {
                return
            }
            setToken(storageEvent.newValue ?? '')
        }

        window.addEventListener('storage', handleTokenChange)
        return () => {
            window.removeEventListener('storage', handleTokenChange)
        }
    }, [])

    useEffect(() => {
        void dispatch(getUserInfo())
    }, [dispatch])

    if (!token || isTokenExpired(token))
        return <Navigate to={PAGE_PATHS.LOGIN} replace />

    return children
}
