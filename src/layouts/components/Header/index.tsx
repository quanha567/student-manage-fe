import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { FaChevronRight, FaUser } from 'react-icons/fa6'
import { IoMdSettings } from 'react-icons/io'
import { IoLogOut } from 'react-icons/io5'

import { Avatar, Popover } from 'antd'

import { LogoImage } from '@/assets'
import { LOCAL_STORAGES, PAGE_PATHS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { selectCurrentUser } from '@/redux/slices'

export const Header = () => {
    const { student, role } = useAppSelector(selectCurrentUser)
    const navigate = useNavigate()

    const handleLogout = useCallback(() => {
        localStorage.setItem(LOCAL_STORAGES.ACCESS_TOKEN, '')
        navigate(PAGE_PATHS.LOGIN)
    }, [navigate])

    const viewMyProfile = () => {
        navigate(PAGE_PATHS.MY_PROFILE)
    }

    return (
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
            <div>
                <Popover
                    trigger="click"
                    placement="bottomRight"
                    title={
                        <div className="flex w-72 flex-col items-center">
                            <div className="flex w-full items-center gap-4 rounded-lg p-2 drop-shadow">
                                <Avatar size="large" className="bg-primary">
                                    {student?.fullName?.charAt(0)}
                                </Avatar>
                                <div>
                                    <p className="text-base font-bold">
                                        {student?.fullName}
                                    </p>
                                    <p>{student?.email}</p>
                                </div>
                            </div>
                            <div className="mt-2 w-full">
                                <div
                                    onClick={viewMyProfile}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-base transition-all hover:bg-zinc-100"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200">
                                        <FaUser className="size-5" />
                                    </div>
                                    <span className="flex-1 font-bold">
                                        Tài khoản
                                    </span>
                                    <FaChevronRight />
                                </div>{' '}
                                <div className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-base transition-all hover:bg-zinc-100">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200">
                                        <IoMdSettings className="size-6" />
                                    </div>
                                    <span className="flex-1 font-bold">
                                        Cài đặt
                                    </span>
                                    <FaChevronRight />
                                </div>
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
                        <Avatar size="large" className="bg-primary">
                            {student?.fullName?.charAt(0)}
                        </Avatar>
                        <div className="flex flex-col items-end">
                            <p className="font-bold leading-none">
                                {student?.fullName}
                            </p>
                            <p className="mt-0.5 leading-none">
                                {role ?? student?.email}
                            </p>
                        </div>
                    </div>
                </Popover>
            </div>
        </header>
    )
}
