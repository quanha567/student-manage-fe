import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { Spin } from 'antd'

import { Header, MySidebar } from './components'

export const AdminLayout = () => {
    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden">
            <Header />
            <div className="flex h-full flex-1">
                <MySidebar />
                <div className="h-full w-full overflow-auto bg-[#F5F6FA] p-4">
                    <Suspense
                        fallback={
                            <div className="flex h-full flex-1 items-center justify-center">
                                <Spin size="large" />
                            </div>
                        }
                    >
                        <div className="mx-auto max-w-screen-xl pb-16">
                            <Outlet />
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
