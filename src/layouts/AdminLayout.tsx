import { ReactNode, Suspense } from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, Outlet } from 'react-router-dom'

import { PieChartFilled, UsergroupDeleteOutlined } from '@ant-design/icons'

import { Spin } from 'antd'

import { LogoImage } from '@/assets'
import { PAGE_PATHS } from '@/constants'

interface MenuItemType {
    children?: MenuItemType[]
    icon: ReactNode
    label: string
    path?: PAGE_PATHS
}

const sideBarMenus: MenuItemType[] = [
    {
        label: 'Tổng quan',
        icon: <PieChartFilled />,
    },
    {
        label: 'Sinh viên',
        icon: <UsergroupDeleteOutlined />,
    },
]

export const AdminLayout = () => {
    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden">
            <header className="flex w-screen justify-between border-b border-zinc-200 bg-white px-4 py-2 drop-shadow-lg">
                <div className="flex items-center gap-2">
                    <img
                        src={LogoImage}
                        alt="logo"
                        className="size-5 object-contain"
                    />
                    <span className="text-xl font-black">
                        Đại học tài nguyên và môi trường
                    </span>
                </div>
                <div></div>
            </header>
            <div className="flex h-full flex-1">
                <Sidebar
                    backgroundColor="#fff"
                    className="h-full drop-shadow-lg">
                    <Menu
                        menuItemStyles={{
                            button: ({ level, active, disabled }) => {
                                // only apply styles on first level elements of the tree
                                if (level === 0)
                                    return {
                                        color: disabled ? '#f5d9ff' : '#ff9900',
                                        backgroundColor: active
                                            ? '#eecef9'
                                            : undefined,
                                    }
                            },
                        }}>
                        {sideBarMenus.map(({ path, label, icon }, index) => (
                            <MenuItem
                                key={index}
                                icon={icon}
                                component={
                                    path ? <Link to={path} /> : undefined
                                }>
                                {label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Sidebar>
                <div className="h-full w-full overflow-auto bg-zinc-200 p-4">
                    <Suspense
                        fallback={
                            <div className="flex h-full flex-1 items-center justify-center">
                                <Spin size="large" />
                            </div>
                        }>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
