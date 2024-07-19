import { BaseModel } from '@/models'

export interface UserModel extends BaseModel {
    blocked?: boolean
    confirmed?: boolean
    email?: string
    provider?: string
    userName?: string
}
