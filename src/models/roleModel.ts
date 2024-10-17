export interface RoleModel {
    createdAt?: string
    description?: string
    id?: number
    name?: string
    type?: UserRole
    updatedAt?: string
}

export enum UserRole {
    AUTHENTICATED = 'authenticated',
    PUBLIC = 'public',
    STUDENT = 'student',
    TEACHER = 'teacher',
}

export enum Role {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
}
