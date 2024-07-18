import { ReactNode } from 'react';

import viVN from 'antd/locale/vi_VN';

import { ConfigProvider } from 'antd';

interface ThemeConfigProviderProps {
  children: ReactNode;
}

export const ThemeConfigProvider = ({ children }: ThemeConfigProviderProps) => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#0f67b1',
          colorInfo: '#0f67b1',
          colorSuccess: '#399918',
          colorWarning: '#ff7f3e',
          colorError: '#e4003a',
          colorLink: '#0ba4f1',
          colorTextBase: '#121212',
          fontSize: 16,
          borderRadius: 8,
          wireframe: false,
        },
        components: {
          Button: {
            algorithm: true,
          },
        },
      }}>
      {children}
    </ConfigProvider>
  );
};
