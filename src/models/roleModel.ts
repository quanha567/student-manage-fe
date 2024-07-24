export interface RoleModel {
    createdAt?: string
    description?: string
    id?: number
    name?: string
    type?: UserRole
    updatedAt?: string
}

export enum UserRole {
    ADMIN = 'Admin',
    STUDENT = 'Student',
    TEACHER = 'Teacher',
}
