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
export const SemesterPage = lazy(() => import('./SemesterPage'))
export const ExamPage = lazy(() => import('./ExamPage'))
export const ManageStudentPointPage = lazy(
    () => import('./ManageStudentPointPage'),
)
export const AcademicYearPage = lazy(() => import('./AcademicYearPage'))
export const MyScorePage = lazy(() => import('./MyScorePage'))
export const RoomPage = lazy(() => import('./RoomPage'))
export const TimeTablePage = lazy(() => import('./TimeTablePage'))
export const UpComingExamPage = lazy(() => import('./UpComingExamPage'))
