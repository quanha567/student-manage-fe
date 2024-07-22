import { ReactNode } from 'react'

import { App, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'

interface ThemeConfigProviderProps {
    children: ReactNode
}

export const ThemeConfigProvider = ({ children }: ThemeConfigProviderProps) => {
    return (
        <ConfigProvider
            wave={{ disabled: true }}
            locale={viVN}
            theme={{
                token: {
                    colorPrimary: '#093',
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
            <App>{children}</App>
        </ConfigProvider>
    )
}
