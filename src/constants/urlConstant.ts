import { ENV_CONFIGS } from '@/configs'
import { createApiURL } from '@/utils'

export enum PAGE_PATHS {
    ACADEMIC_YEAR = '/academic_year',
    CLASS_LIST = '/classes',
    COURSES_LIST = '/courses',
    DASHBOARD = '/',
    DEPARTMENT_LIST = '/departments',
    EXAM_LIST = '/exams',
    LOGIN = '/login',
    MANAGE_POINT = '/manage-point',
    MY_PROFILE = '/my-profile',
    REGISTER_COURSE = '/register-course',
    SEMESTER_LIST = '/semesters',
    STUDENT_LIST = '/students',
    SUBJECT_LIST = '/subjects',
    SYLLABUS_LIST = '/syllabuses',
    TEACHER_LIST = '/teachers',
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
    STUDENT_DOWNLOAD_FILE: createApiURL('students/download-example'),
    STUDENT_IMPORT_FILE: createApiURL('students/import'),
    studentWithId: (id: number) => `students/${String(id)}`,

    // Student api url
    TEACHERS: 'teachers',
    teacherWithId: (id: number) => `teachers/${String(id)}`,

    // Upload api url
    UPLOAD: '/upload',

    // subject api url
    SUBJECTS: 'subjects',
    subjectWithId: (id: number) => `subjects/${String(id)}`,

    // syllabus api url
    SYLLABUS: 'syllabuses',
    syllabusWithId: (id: number) => `syllabuses/${String(id)}`,

    // COURSE api url
    COURSES: 'courses',
    courseWithId: (id: number) => `courses/${String(id)}`,

    // SECTION api url
    SECTIONS: 'sections',
    sectionWithId: (id: number) => `sections/${String(id)}`,

    // SECTION api url
    ENROLLMENTS: 'enrollments',
    enrollmentWithId: (id: number) => `enrollments/${String(id)}`,

    // SEMESTER api url
    SEMESTERS: 'semesters',
    semesterWithId: (id: number) => `semesters/${String(id)}`,

    // SEMESTER api url
    EXAMS: 'exams',
    examWithId: (id: number) => `exams/${String(id)}`,

    // SEMESTER api url
    ACADEMIC_YEAR: 'academic-years',
    academicYearWithId: (id: number) => `academic-years/${String(id)}`,

    SUMMARY_REPORT: 'summary-report',
}
