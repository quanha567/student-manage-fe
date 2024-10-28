import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { PAGE_PATHS } from '@/constants'
import { AuthGuard } from '@/guards'
import {
    AcademicYearPage,
    ClassPage,
    CoursesPage,
    DashboardPage,
    DepartmentPage,
    ExamPage,
    LoginPage,
    ManageStudentPointPage,
    MyProfilePage,
    MyScorePage,
    RegisterCoursePage,
    SemesterPage,
    StudentPage,
    SubjectPage,
    SyllabusPage,
    TeacherPage,
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
            {
                path: PAGE_PATHS.COURSES_LIST,
                element: <CoursesPage />,
            },
            {
                path: PAGE_PATHS.TEACHER_LIST,
                element: <TeacherPage />,
            },
            {
                path: PAGE_PATHS.REGISTER_COURSE,
                element: <RegisterCoursePage />,
            },
            {
                path: PAGE_PATHS.SEMESTER_LIST,
                element: <SemesterPage />,
            },
            {
                path: PAGE_PATHS.EXAM_LIST,
                element: <ExamPage />,
            },
            {
                path: PAGE_PATHS.MANAGE_POINT,
                element: <ManageStudentPointPage />,
            },
            {
                path: PAGE_PATHS.ACADEMIC_YEAR,
                element: <AcademicYearPage />,
            },
            {
                path: PAGE_PATHS.MY_SCORE,
                element: <MyScorePage />,
            },
        ],
    },
    {
        path: PAGE_PATHS.LOGIN,
        element: <LoginPage />,
    },
])
