import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { FaChevronRight, FaUser } from 'react-icons/fa6'
import { IoLogOut } from 'react-icons/io5'

import { Popover } from 'antd'

import { LogoImage } from '@/assets'
import { CustomImage } from '@/components'
import { LOCAL_STORAGES, PAGE_PATHS } from '@/constants'
import { useAppSelector, useRole } from '@/hooks'
import { selectCurrentUser } from '@/redux/slices'

export const Header = () => {
    const navigate = useNavigate()

    const { student, role, teacher, email } = useAppSelector(selectCurrentUser)

    const { isAdminRole } = useRole()

    const handleLogout = useCallback(() => {
        localStorage.setItem(LOCAL_STORAGES.ACCESS_TOKEN, '')
        navigate(PAGE_PATHS.LOGIN)
    }, [navigate])

    const viewMyProfile = () => navigate(PAGE_PATHS.MY_PROFILE)
    const gotoDashboard = () => navigate(PAGE_PATHS.DASHBOARD)

    return (
        <header className="flex w-screen justify-between border-b border-zinc-200 bg-white px-4 py-2 drop-shadow-lg">
            <div className="flex items-center gap-2">
                <img
                    alt="logo"
                    src={LogoImage}
                    onClick={gotoDashboard}
                    className="size-10 cursor-pointer object-contain"
                />
                <span className="text-xl font-black">
                    Trường Đại học Tài Nguyên và Môi Trường
                </span>
            </div>
            <div>
                <Popover
                    trigger="click"
                    placement="bottomRight"
                    title={
                        <div className="flex w-72 flex-col items-center">
                            <div className="flex w-full items-center gap-4 rounded-lg p-2 drop-shadow">
                                <CustomImage
                                    src={student?.avatar ?? teacher?.avatar}
                                    alt={student?.fullName}
                                    className="aspect-square object-cover"
                                    containerClass="overflow-hidden rounded-full"
                                    size="thumbnail"
                                    imgSize={40}
                                    preview={false}
                                />
                                <div>
                                    <p className="line-clamp-1 text-base font-bold">
                                        {student?.fullName ??
                                            teacher?.fullName ??
                                            'Admin'}
                                    </p>
                                    <p className="line-clamp-1">
                                        {student?.email ??
                                            teacher?.email ??
                                            email}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 w-full">
                                {!isAdminRole && (
                                    <div
                                        onClick={viewMyProfile}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-base transition-all hover:bg-zinc-100"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200">
                                            <FaUser className="size-5" />
                                        </div>
                                        <span className="flex-1 font-bold">
                                            Hồ sơ của tôi
                                        </span>
                                        <FaChevronRight />
                                    </div>
                                )}
                                <div
                                    onClick={handleLogout}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-base transition-all hover:bg-zinc-100"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200">
                                        <IoLogOut className="size-6" />
                                    </div>
                                    <span className="font-bold">Đăng xuất</span>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <div className="flex cursor-pointer flex-row-reverse items-center gap-1 rounded-lg px-3 py-1 hover:bg-zinc-100">
                        <CustomImage
                            src={student?.avatar ?? teacher?.avatar}
                            alt={student?.fullName ?? teacher?.fullName}
                            className="aspect-square object-cover"
                            containerClass="overflow-hidden rounded-full"
                            size="thumbnail"
                            imgSize={40}
                            preview={false}
                        />
                        <div className="flex flex-col items-end">
                            <p className="font-bold leading-none">
                                {student?.fullName ?? teacher?.fullName}
                            </p>
                            <p className="mt-0.5 leading-none">
                                {role?.name ??
                                    student?.email ??
                                    student?.phoneNumber ??
                                    ''}
                            </p>
                        </div>
                    </div>
                </Popover>
            </div>
        </header>
    )
}
