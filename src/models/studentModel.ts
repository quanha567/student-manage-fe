import { BaseModel } from '@/models'

export interface StudentModel extends BaseModel {
    address?: string
    classId?: string
    dateOfBirth?: string
    email?: string
    enrollments?: unknown
    examResults?: unknown
    fullName?: string
    gender?: Gender
    phoneNumber?: string
    studentId?: string
}

export enum Gender {
    FEMALE = 'FEMALE',
    MALE = 'MALE',
    OTHER = 'OTHER',
}
