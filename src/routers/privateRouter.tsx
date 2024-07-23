import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { PAGE_PATHS } from '@/constants'
import {
    DashboardPage,
    DepartmentPage,
    LoginPage,
    MyProfilePage,
    StudentPage,
} from '@/pages'

export const privateRouters = createBrowserRouter([
    {
        path: PAGE_PATHS.DASHBOARD,
        element: <App />,
        children: [
            {
                path: PAGE_PATHS.DASHBOARD,
                element: <DashboardPage />,
            },
            {
                path: PAGE_PATHS.DEPARTMENT_LIST,
                element: <DepartmentPage />,
            },
            {
                path: PAGE_PATHS.STUDENT_LIST,
                element: <StudentPage />,
            },
            {
                path: PAGE_PATHS.MY_PROFILE,
                element: <MyProfilePage />,
            },
        ],
    },
    {
        path: PAGE_PATHS.LOGIN,
        element: <LoginPage />,
    },
])
