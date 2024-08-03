import { ENV_CONFIGS } from '@/configs'
import { createApiURL } from '@/utils'

export enum PAGE_PATHS {
    CLASS_LIST = '/classes',
    DASHBOARD = '/',
    DEPARTMENT_LIST = '/departments',
    LOGIN = '/login',
    MY_PROFILE = '/my-profile',
    STUDENT_LIST = '/students',
    SUBJECT_LIST = '/subjects',
    SYLLABUS_LIST = '/syllabuses',
}

export const API_URL = {
    BASE: `${ENV_CONFIGS.BASE_URL}/api`,
    // Auth Api Url
    LOGIN: createApiURL('auth/local'),
    REGISTER: 'auth/local/register',

    // User Api Url
    USERS: '/users',
    USER_INFO: createApiURL('users/me'),

    // Department Api url
    DEPARTMENTS: '/departments',
    departmentWithId: (id: number) => `/departments/${String(id)}`,
    DELETE_DEPARTMENTS: 'departments/delete-multiple',

    // Department Api url
    CLASSES: '/classes',
    classWithId: (id: number) => `/classes/${String(id)}`,

    // Student api url
    STUDENT_LOGIN: createApiURL('students/login'),
    STUDENTS: 'students',
    studentWithId: (id: number) => `students/${String(id)}`,

    // Upload api url
    UPLOAD: '/upload',

    // subject api url
    SUBJECTS: 'subjects',
    subjectWithId: (id: number) => `subjects/${String(id)}`,

    // syllabus api url
    SYLLABUS: 'syllabuses',
    syllabusWithId: (id: number) => `syllabuses/${String(id)}`,
}
