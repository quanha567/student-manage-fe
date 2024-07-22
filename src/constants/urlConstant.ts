import { createApiURL } from '@/utils'

export enum PAGE_PATHS {
    DASHBOARD = '/',
    DEPARTMENT_LIST = '/departments',
    LOGIN = '/login',
    STUDENT_LIST = '/students',
}

export const API_URL = {
    // Auth Api Url
    LOGIN: createApiURL('auth/local'),

    // User Api Url
    USERS: '/users',

    // Department Api url
    DEPARTMENTS: '/departments',
}
