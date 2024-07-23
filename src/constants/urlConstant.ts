import { createApiURL } from '@/utils'

export enum PAGE_PATHS {
    DASHBOARD = '/',
    DEPARTMENT_LIST = '/departments',
    LOGIN = '/login',
    MY_PROFILE = '/my-profile',
    STUDENT_LIST = '/students',
}

export const API_URL = {
    // Auth Api Url
    LOGIN: createApiURL('auth/local'),

    // User Api Url
    USERS: '/users',

    // Department Api url
    DEPARTMENTS: '/departments',

    // Student api url
    STUDENT_LOGIN: createApiURL('students/login'),
}
