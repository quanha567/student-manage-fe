import { ReactNode, useState } from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'

import { AiFillProduct } from 'react-icons/ai'
import { FaBook, FaListCheck, FaNoteSticky } from 'react-icons/fa6'
import { GiPieChart } from 'react-icons/gi'
import { HiRectangleGroup } from 'react-icons/hi2'
import { IoIosAddCircle, IoIosArrowBack } from 'react-icons/io'
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
        path: PAGE_PATHS.CLASS_LIST,
    },
    {
        label: 'Giáo viên',
        icon: <PiChalkboardTeacherFill className="size-6" />,
        path: PAGE_PATHS.TEACHER_LIST,
    },
    {
        label: 'Sinh viên',
        icon: <PiStudentFill className="size-6" />,
        path: PAGE_PATHS.STUDENT_LIST,
    },
    {
        label: 'Môn học',
        icon: <FaBook className="size-5" />,
        path: PAGE_PATHS.SUBJECT_LIST,
    },
    {
        label: 'Đề cương',
        icon: <IoDocumentText className="size-6" />,
        path: PAGE_PATHS.SYLLABUS_LIST,
    },
    {
        label: 'Học phần',
        icon: <HiRectangleGroup className="size-6" />,
        path: PAGE_PATHS.COURSES_LIST,
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
        label: 'Đăng ký học phần',
        icon: <IoIosAddCircle className="size-6" />,
        path: PAGE_PATHS.REGISTER_COURSE,
    },
    {
        label: 'Kết quả thi',
        icon: <PiExamFill className="size-6" />,
    },
    {
        label: 'Học kỳ',
        icon: <PiExamFill className="size-6" />,
        path: PAGE_PATHS.SEMESTER_LIST,
    },
]

export const MySidebar = () => {
    const { pathname } = useLocation()

    const [isCollapseSidebar, setIsCollapseSidebar] = useState<boolean>(false)

    const toggleCollapse = () => setIsCollapseSidebar(!isCollapseSidebar)

    return (
        <div className="relative">
            <div
                onClick={toggleCollapse}
                className="absolute right-0 top-2 z-10 flex size-6 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-white drop-shadow"
            >
                <IoIosArrowBack
                    className={`transition-all duration-500 ${isCollapseSidebar ? 'rotate-180' : ''}`}
                />
            </div>
            <Sidebar
                backgroundColor="#fff"
                collapsed={isCollapseSidebar}
                className="h-full drop-shadow-lg"
            >
                <Menu
                    menuItemStyles={{
                        button: {
                            // the active class will be added automatically by react router
                            // so we can use it to style the active menu item
                            [`&.active`]: {
                                backgroundColor: '#d72134',
                                color: '#ffffff',
                            },
                        },
                    }}
                >
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
                                className={`select-none text-base font-bold transition-all ${isActive ? '!bg-primary text-white hover:!bg-primary' : ''}`}
                            >
                                {label}
                            </MenuItem>
                        )
                    })}
                </Menu>
            </Sidebar>
        </div>
    )
}
