import { UserModel } from '@/models'

export interface LoginRequestModel {
    identifier: string
    password: string
}

export interface LoginResponseModel {
    jwt: string
    user: UserModel
}
