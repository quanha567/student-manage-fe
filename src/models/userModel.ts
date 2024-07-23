import { BaseModel, StudentModel } from '@/models'

export interface UserModel extends BaseModel {
    blocked?: boolean
    confirmed?: boolean
    email?: string
    provider?: string
    role?: UserRole
    student?: StudentModel
    userName?: string
}

export enum UserRole {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
}
