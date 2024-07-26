import { ENV_CONFIGS } from '@/configs'
import { createApiURL } from '@/utils'

export enum PAGE_PATHS {
    CLASS_LIST = '/classes',
    DASHBOARD = '/',
    DEPARTMENT_LIST = '/departments',
    LOGIN = '/login',
    MY_PROFILE = '/my-profile',
    STUDENT_LIST = '/students',
}

export const API_URL = {
    BASE: `${ENV_CONFIGS.BASE_URL}/api`,
    // Auth Api Url
    LOGIN: createApiURL('auth/local'),

    // User Api Url
    USERS: '/users',
    USER_INFO: createApiURL('users/me'),

    // Department Api url
    DEPARTMENTS: '/departments',
    departmentWithId: (id: number) => `/departments/${String(id)}`,

    // Department Api url
    CLASSES: '/classes',
    classWithId: (id: number) => `/classes/${String(id)}`,

    // Student api url
    STUDENT_LOGIN: createApiURL('students/login'),

    // Upload api url
    UPLOAD: '/upload',
}
