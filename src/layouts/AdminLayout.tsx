import { ReactNode, Suspense } from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, Outlet, useLocation } from 'react-router-dom'

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
        label: 'Khoa',
        icon: <UsergroupDeleteOutlined />,
        path: PAGE_PATHS.DEPARTMENT_LIST,
    },
    {
        label: 'Lớp học',
        icon: <UsergroupDeleteOutlined />,
    },
    {
        label: 'Sinh viên',
        icon: <UsergroupDeleteOutlined />,
        path: PAGE_PATHS.STUDENT_LIST,
    },
    {
        label: 'Môn học',
        icon: <UsergroupDeleteOutlined />,
    },
    {
        label: 'Đề cương',
        icon: <UsergroupDeleteOutlined />,
    },
    {
        label: 'Học phần',
        icon: <UsergroupDeleteOutlined />,
    },
    {
        label: 'Ghi danh',
        icon: <UsergroupDeleteOutlined />,
    },
    {
        label: 'Kiểm tra',
        icon: <UsergroupDeleteOutlined />,
    },
    {
        label: 'Kết quả thi',
        icon: <UsergroupDeleteOutlined />,
    },
]

export const AdminLayout = () => {
    const { pathname } = useLocation()

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden">
            <header className="flex w-screen justify-between border-b border-zinc-200 bg-white px-4 py-2 drop-shadow-lg">
                <div className="flex items-center gap-2">
                    <img
                        src={LogoImage}
                        alt="logo"
                        className="size-10 object-contain"
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
                    className="h-full drop-shadow-lg"
                >
                    <Menu>
                        {sideBarMenus.map(({ path, label, icon }, index) => {
                            const isActive = pathname === String(path)
                            return (
                                <MenuItem
                                    key={index}
                                    icon={icon}
                                    component={
                                        path ? <Link to={path} /> : undefined
                                    }
                                    active={isActive}
                                    className={`text-base font-medium transition-all ${isActive ? 'rounded-full bg-primary text-white' : ''}`}
                                >
                                    {label}
                                </MenuItem>
                            )
                        })}
                    </Menu>
                </Sidebar>
                <div className="h-full w-full overflow-auto bg-[#F5F6FA] p-4">
                    <Suspense
                        fallback={
                            <div className="flex h-full flex-1 items-center justify-center">
                                <Spin size="large" />
                            </div>
                        }
                    >
                        <div className="mx-auto max-w-screen-xl">
                            <Outlet />
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
