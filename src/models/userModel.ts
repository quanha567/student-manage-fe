import { BaseModel, RoleModel, StudentModel } from '@/models'

export interface UserModel extends BaseModel {
    blocked?: boolean
    confirmed?: boolean
    email?: string
    provider?: string
    role?: RoleModel
    student?: StudentModel
    userName?: string
}
