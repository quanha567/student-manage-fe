import { ReactNode, Suspense } from 'react';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Link, Outlet } from 'react-router-dom';

import { PieChartFilled, UsergroupDeleteOutlined } from '@ant-design/icons';

import { Spin } from 'antd';

import { Logo } from '@/assets/svgs';
import { PAGE_PATHS } from '@/constants';

interface MenuItemType {
  children?: MenuItemType[];
  icon: ReactNode;
  label: string;
  path?: PAGE_PATHS;
}

const sideBarMenus: MenuItemType[] = [
  {
    label: 'Tổng quan',
    icon: <PieChartFilled />,
  },
  {
    label: 'Sinh viên',
    icon: <UsergroupDeleteOutlined />,
  },
];

export const AdminLayout = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <header className="bg-white w-screen flex justify-between drop-shadow-lg py-2 px-4 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <img src={Logo} />
          <span className="font-black text-xl">Student Manage Admin</span>
        </div>
        <div></div>
      </header>
      <div className="h-full flex flex-1">
        <Sidebar backgroundColor="#fff" className="h-full drop-shadow-lg">
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    color: disabled ? '#f5d9ff' : '#ff9900',
                    backgroundColor: active ? '#eecef9' : undefined,
                  };
              },
            }}>
            {sideBarMenus.map(({ path, label, icon }, index) => (
              <MenuItem
                key={index}
                icon={icon}
                component={path ? <Link to={path} /> : undefined}>
                {label}
              </MenuItem>
            ))}
          </Menu>
        </Sidebar>
        <div className="w-full h-full bg-zinc-200 p-4 overflow-auto">
          <Suspense
            fallback={
              <div className="flex h-full flex-1 items-center justify-center">
                <Spin size="large" />
              </div>
            }>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
