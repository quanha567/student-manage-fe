import { RouterProvider as ReactRouterProvider } from 'react-router-dom'

import { Spin } from 'antd'

import { privateRouters } from '@/routers'

export const RouterProvider = () => {
    return (
        <ReactRouterProvider
            router={privateRouters}
            fallbackElement={
                <div className="fixed bottom-0 left-0 right-0 top-0 bg-black/50">
                    <Spin size="large" />
                </div>
            }
            future={{ v7_startTransition: true }}
        />
    )
}
