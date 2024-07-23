import { ReactNode } from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'

import { AiFillProduct } from 'react-icons/ai'
import { FaBook, FaListCheck, FaNoteSticky } from 'react-icons/fa6'
import { GiPieChart } from 'react-icons/gi'
import { HiRectangleGroup } from 'react-icons/hi2'
import { IoDocumentText } from 'react-icons/io5'
import { MdClass } from 'react-icons/md'
import {
    PiChalkboardTeacherFill,
    PiExamFill,
    PiStudentFill,
} from 'react-icons/pi'

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
        icon: <GiPieChart className="size-6" />,
        path: PAGE_PATHS.DASHBOARD,
    },
    {
        label: 'Khoa',
        icon: <AiFillProduct className="size-6" />,
        path: PAGE_PATHS.DEPARTMENT_LIST,
    },
    {
        label: 'Lớp học',
        icon: <MdClass className="size-6" />,
    },
    {
        label: 'Giáo viên',
        icon: <PiChalkboardTeacherFill className="size-6" />,
        path: PAGE_PATHS.STUDENT_LIST,
    },
    {
        label: 'Sinh viên',
        icon: <PiStudentFill className="size-6" />,
        path: PAGE_PATHS.STUDENT_LIST,
    },
    {
        label: 'Môn học',
        icon: <FaBook className="size-5" />,
    },
    {
        label: 'Đề cương',
        icon: <IoDocumentText className="size-6" />,
    },
    {
        label: 'Học phần',
        icon: <HiRectangleGroup className="size-6" />,
    },
    {
        label: 'Ghi danh',
        icon: <FaListCheck className="size-6" />,
    },
    {
        label: 'Kiểm tra',
        icon: <FaNoteSticky className="size-6" />,
    },
    {
        label: 'Kết quả thi',
        icon: <PiExamFill className="size-6" />,
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
                            className={`select-none text-base font-bold transition-all ${isActive ? 'bg-primary text-white' : ''}`}
                        >
                            {label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </Sidebar>
    )
}
