import { ReactNode } from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'

import { PieChartFilled, UsergroupDeleteOutlined } from '@ant-design/icons'

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

export const MySidebar = () => {
    const { pathname } = useLocation()

    return (
        <Sidebar backgroundColor="#fff" className="h-full drop-shadow-lg">
            <Menu>
                {sideBarMenus.map(({ path, label, icon }, index) => {
                    const isActive = pathname === String(path)
                    return (
                        <MenuItem
                            key={index}
                            icon={icon}
                            component={path ? <Link to={path} /> : undefined}
                            active={isActive}
                            className={`text-base font-medium transition-all ${isActive ? 'rounded-full bg-primary text-white' : ''}`}
                        >
                            {label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </Sidebar>
    )
}
