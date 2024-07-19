import { LoginBackground, LoginForm, Logo, WelcomeText } from './components'

const LoginPage = () => {
    return (
        <div className="grid grid-cols-[1fr_2fr]">
            <div className="flex h-full flex-col justify-center px-10">
                <Logo />
                <WelcomeText />
                <LoginForm />
            </div>
            <LoginBackground />
        </div>
    )
}

export default LoginPage
