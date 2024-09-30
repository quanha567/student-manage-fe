import { ReactNode } from 'react'

import dayjs from 'dayjs'

import { App, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'

import 'dayjs/locale/vi'
interface ThemeConfigProviderProps {
    children: ReactNode
}

dayjs.locale('vi')

export const ThemeConfigProvider = ({ children }: ThemeConfigProviderProps) => {
    return (
        <ConfigProvider
            wave={{ disabled: true }}
            locale={viVN}
            theme={{
                token: {
                    colorPrimary: '#d72134',
                    colorInfo: '#0f67b1',
                    colorSuccess: '#399918',
                    colorWarning: '#ff7f3e',
                    colorError: '#e4003a',
                    colorLink: '#0ba4f1',
                    colorTextBase: '#121212',
                    fontSize: 14,
                    borderRadius: 8,
                    wireframe: false,
                },
                components: {
                    Button: {
                        algorithm: true,
                    },
                },
            }}
        >
            <App
                notification={{
                    placement: 'bottomRight',
                    showProgress: true,
                    pauseOnHover: true,
                    stack: true,
                }}
            >
                {children}
            </App>
        </ConfigProvider>
    )
}
