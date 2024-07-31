import { BaseModel, RoleModel, StudentModel } from '@/models'

export interface UserModel extends BaseModel {
    blocked?: boolean
    confirmed?: boolean
    email?: string
    id?: number
    provider?: string
    role?: RoleModel
    student?: StudentModel
    userName?: string
}

export interface UserCreateRequestModel {
    email: string
    password: string
    role: number
    username: string
}
