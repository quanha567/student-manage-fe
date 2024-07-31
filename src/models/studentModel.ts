import { Dayjs } from 'dayjs'

import { BaseModel, ClassModel, ImageModel, UserModel } from '@/models'
import { SingleData } from '@/types'

export interface StudentModel extends BaseModel {
    address?: string
    avatar?: ImageModel
    class?: SingleData<ClassModel>
    dateOfBirth?: string | Dayjs
    email?: string
    enrollments?: unknown
    examResults?: unknown
    fullName?: string
    gender?: Gender
    id?: number
    note?: string
    phoneNumber?: string
    studentId?: string
    user?: UserModel
}

export type StudentRequestModel = Omit<StudentModel, 'avatar' | 'class'> & {
    avatar?: unknown
    classId?: number
    class?: number
    user?: number
}

export enum Gender {
    FEMALE = 'FEMALE',
    MALE = 'MALE',
    OTHER = 'OTHER',
}

export interface StudentLoginRequestModel {
    email: string
    password: string
}

export interface StudentLoginResponseModel {
    jwt: string
    user: UserModel
}
