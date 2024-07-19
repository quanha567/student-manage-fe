import { LoginBackgroundImage } from '@/assets'

export const LoginBackground = () => {
    return (
        <div className="h-screen w-full select-none overflow-hidden">
            <img
                src={LoginBackgroundImage}
                className="h-full w-full object-cover"
            />
        </div>
    )
}
