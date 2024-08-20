import { lazy } from 'react'

export { default as LoginPage } from './LoginPage'
export const DashboardPage = lazy(() => import('./DashboardPage'))
export const StudentPage = lazy(() => import('./StudentPage'))
export const DepartmentPage = lazy(() => import('./DepartmentPage'))
export const MyProfilePage = lazy(() => import('./MyProfilePage'))
export const ClassPage = lazy(() => import('./ClassPage'))
export const SubjectPage = lazy(() => import('./SubjectPage'))
export const SyllabusPage = lazy(() => import('./SyllabusPage'))
export const CoursesPage = lazy(() => import('./CoursesPage'))
export const TeacherPage = lazy(() => import('./TeacherPage'))
export const RegisterCoursePage = lazy(() => import('./RegisterCoursePage'))
