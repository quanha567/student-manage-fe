import { Dayjs } from 'dayjs'

import {
    BaseModel,
    ClassModel,
    EnrollmentModel,
    ImageModel,
    UserModel,
} from '@/models'
import { SingleData } from '@/types'

import { AcademicYearModel } from './academicYearModel'
import { RelativeModel } from './relativeModel'

export interface StudentModel extends BaseModel {
    academicYear?: SingleData<AcademicYearModel>
    address?: string
    avatar?: ImageModel
    class?: SingleData<ClassModel>
    cmndCreatedDate?: string | Dayjs
    cmndNumber?: string
    cmndPlace?: string
    dateJoinCommunistParty?: string | Dayjs
    dateJoinYouthUnion?: string | Dayjs
    dateOfBirth?: string | Dayjs
    district?: string
    email?: string
    enrollments?: EnrollmentModel[]
    examResults?: unknown
    father?: RelativeModel
    fullName?: string
    gender?: Gender
    id?: number
    mother?: RelativeModel
    nanny?: RelativeModel
    nation?: string
    note?: string
    origin?: string
    personalEmail?: string
    phoneNumber?: string
    placeOfBirth?: string
    province?: string
    religion?: string
    status?: UserStatus
    studentCode?: string
    studentId?: string
    user?: UserModel
    ward?: string
}

export type StudentRequestModel = Omit<StudentModel, 'avatar' | 'class'> & {
    avatar?: unknown
    classId?: number
    class?: number
    user?: number
    academicYear?: number
}

export enum Gender {
    FEMALE = 'FEMALE',
    MALE = 'MALE',
    OTHER = 'OTHER',
}

export enum UserStatus {
    ENDED = 'ENDED',
    FINISHED = 'FINISHED',
    LEARNING = 'LEARNING',
    PAUSED = 'PAUSED',
}

export interface StudentLoginRequestModel {
    email: string
    password: string
}

export interface StudentLoginResponseModel {
    jwt: string
    user: UserModel
}
