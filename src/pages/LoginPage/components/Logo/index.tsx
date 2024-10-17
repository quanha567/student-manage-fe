import { LogoImage } from '@/assets'

export const Logo = () => {
    return (
        <div className="flex flex-col items-center gap-4">
            <img
                src={LogoImage}
                alt="logo"
                className="size-32 object-contain"
            />
            <span className="text-pretty text-center text-3xl font-bold">
                Trường Đại học Tài Nguyên và Môi Trường
            </span>
        </div>
    )
}
