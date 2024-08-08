import { Dayjs } from 'dayjs'

import { ListData } from '@/types'

import { BaseModel } from './baseModel'
import { ClassModel } from './classModel'
import { ImageModel } from './imageModel'
import { Gender } from './studentModel'
import { UserModel } from './userModel'

export interface TeacherModel extends BaseModel {
    address?: string
    avatar?: ImageModel
    classes?: ListData<ClassModel>
    dateOfBirth?: string | Dayjs
    email?: string
    fullName?: string
    gender?: Gender
    id?: number
    note?: string
    phoneNumber?: string
    teacherCode?: string
    user?: UserModel
}

export type TeacherRequestModel = Omit<TeacherModel, 'avatar' | 'classes'> & {
    avatar?: unknown
    classes?: number[]
    user?: number
}
