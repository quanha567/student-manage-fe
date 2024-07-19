import { createApiURL } from '@/utils'

export enum PAGE_PATHS {
    DASHBOARD = '/',
    LOGIN = '/login',
    STUDENT_LIST = '/students',
}

export const API_URL = {
    // Auth Api Url
    LOGIN: createApiURL('auth/local'),

    // User Api Url
    USER: createApiURL('users'),
}
