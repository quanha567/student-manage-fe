import { selectCurrentUser } from '@/redux'

import { useAppSelector } from './useAppSelector'

export const useRole = () => {
    const user = useAppSelector(selectCurrentUser)

    const isStudentRole = !!user.student
    const isTeacherRole = !!user.teacher
    const isAdminRole = !(isStudentRole || isTeacherRole)

    return { isStudentRole, isTeacherRole, isAdminRole } as const
}
