import { ReactNode, useMemo, useState } from 'react'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'

import {
    FaBook,
    FaCalendarDay,
    FaListCheck,
    FaNoteSticky,
    FaUser,
} from 'react-icons/fa6'
import { GiPieChart } from 'react-icons/gi'
import { HiAcademicCap, HiRectangleGroup } from 'react-icons/hi2'
import { IoIosAddCircle, IoIosArrowBack } from 'react-icons/io'
import { IoDocumentText } from 'react-icons/io5'
import { MdClass } from 'react-icons/md'
import {
    PiChalkboardTeacherFill,
    PiExamFill,
    PiStudentFill,
} from 'react-icons/pi'

import { PAGE_PATHS } from '@/constants'
import { useRole } from '@/hooks'
import { Role } from '@/models'

interface MenuItemType {
    children?: MenuItemType[]
    icon: ReactNode
    label: string
    path?: PAGE_PATHS
    role: Role[]
}

const sideBarMenus: MenuItemType[] = [
    {
        label: 'Tổng quan',
        icon: <GiPieChart className="size-6" />,
        path: PAGE_PATHS.DASHBOARD,
        role: [Role.ADMIN],
    },

    {
        label: 'Hồ sơ của tôi',
        icon: <FaUser className="size-6" />,
        path: PAGE_PATHS.MY_PROFILE,
        role: [Role.TEACHER],
    },
    {
        label: 'Lớp học',
        icon: <MdClass className="size-6" />,
        path: PAGE_PATHS.CLASS_LIST,
        role: [Role.ADMIN],
    },
    {
        label: 'Giảng viên',
        icon: <PiChalkboardTeacherFill className="size-6" />,
        path: PAGE_PATHS.TEACHER_LIST,
        role: [Role.ADMIN],
    },
    {
        label: 'Sinh viên',
        icon: <PiStudentFill className="size-6" />,
        path: PAGE_PATHS.STUDENT_LIST,
        role: [Role.ADMIN],
    },
    {
        label: 'Môn học',
        icon: <FaBook className="size-5" />,
        path: PAGE_PATHS.SUBJECT_LIST,
        role: [Role.ADMIN, Role.TEACHER],
    },
    {
        label: 'Đề cương',
        icon: <IoDocumentText className="size-6" />,
        path: PAGE_PATHS.SYLLABUS_LIST,
        role: [Role.ADMIN, Role.TEACHER],
    },
    {
        label: 'Học phần',
        icon: <HiRectangleGroup className="size-6" />,
        path: PAGE_PATHS.COURSES_LIST,
        role: [Role.ADMIN],
    },
    {
        label: 'Học kỳ',
        icon: <FaCalendarDay className="size-6" />,
        path: PAGE_PATHS.SEMESTER_LIST,
        role: [Role.ADMIN],
    },
    {
        label: 'Niên khóa',
        icon: <HiAcademicCap className="size-6" />,
        path: PAGE_PATHS.ACADEMIC_YEAR,
        role: [Role.ADMIN],
    },
    {
        label: 'Ghi danh',
        icon: <FaListCheck className="size-6" />,
        role: [Role.ADMIN],
    },
    {
        label: 'Kiểm tra, thi',
        icon: <FaNoteSticky className="size-6" />,
        path: PAGE_PATHS.EXAM_LIST,
        role: [Role.ADMIN, Role.TEACHER],
    },
    {
        label: 'Đăng ký học phần',
        icon: <IoIosAddCircle className="size-6" />,
        path: PAGE_PATHS.REGISTER_COURSE,
        role: [Role.ADMIN],
    },
    {
        label: 'Quản lý điểm',
        icon: <PiExamFill className="size-6" />,
        path: PAGE_PATHS.MANAGE_POINT,
        role: [Role.ADMIN],
    },
]

export const MySidebar = () => {
    const { pathname } = useLocation()

    const [isCollapseSidebar, setIsCollapseSidebar] = useState<boolean>(false)

    const { isAdminRole, isStudentRole, isTeacherRole } = useRole()

    const sideBarMenuByRole: MenuItemType[] = useMemo(() => {
        switch (true) {
            case isAdminRole:
                return sideBarMenus.filter((menu) =>
                    menu.role.includes(Role.ADMIN),
                )
            case isTeacherRole:
                return sideBarMenus.filter((menu) =>
                    menu.role.includes(Role.TEACHER),
                )
            case isStudentRole:
                return sideBarMenus.filter((menu) =>
                    menu.role.includes(Role.STUDENT),
                )

            default:
                return []
        }
    }, [isAdminRole, isStudentRole, isTeacherRole])

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
                                backgroundColor: '#009933',
                                color: '#ffffff',
                            },
                        },
                    }}
                >
                    {sideBarMenuByRole.map(({ path, label, icon }, index) => {
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
