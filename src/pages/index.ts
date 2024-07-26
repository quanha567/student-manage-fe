import { lazy } from 'react'

export { default as LoginPage } from './LoginPage'
export const DashboardPage = lazy(() => import('./DashboardPage'))
export const StudentPage = lazy(() => import('./StudentPage'))
export const DepartmentPage = lazy(() => import('./DepartmentPage'))
export const MyProfilePage = lazy(() => import('./MyProfilePage'))
export const ClassPage = lazy(() => import('./ClassPage'))
