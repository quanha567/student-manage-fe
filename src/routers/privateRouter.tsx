import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { PAGE_PATHS } from '@/constants'
import { AuthGuard } from '@/guards'
import {
    ClassPage,
    DashboardPage,
    DepartmentPage,
    LoginPage,
    MyProfilePage,
    StudentPage,
    SubjectPage,
    SyllabusPage,
} from '@/pages'

export const privateRouters = createBrowserRouter([
    {
        path: PAGE_PATHS.DASHBOARD,
        element: (
            <AuthGuard>
                <App />
            </AuthGuard>
        ),
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
                path: PAGE_PATHS.CLASS_LIST,
                element: <ClassPage />,
            },
            {
                path: PAGE_PATHS.STUDENT_LIST,
                element: <StudentPage />,
            },
            {
                path: PAGE_PATHS.MY_PROFILE,
                element: <MyProfilePage />,
            },
            {
                path: PAGE_PATHS.SUBJECT_LIST,
                element: <SubjectPage />,
            },
            {
                path: PAGE_PATHS.SYLLABUS_LIST,
                element: <SyllabusPage />,
            },
        ],
    },
    {
        path: PAGE_PATHS.LOGIN,
        element: <LoginPage />,
    },
])
