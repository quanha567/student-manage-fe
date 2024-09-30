import { Dayjs } from 'dayjs'

import { ListData, SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { ClassModel } from './classModel'
import { ExamModel } from './examModel'
import { SectionModel } from './sectionModel'
import { SemesterModel } from './semesterModel'
import { SubjectModel } from './subjectModel'

export interface CourseModel extends BaseModel {
    classes?: ListData<ClassModel>
    code?: string
    courseType?: CourseType
    credits?: number
    endDate?: string | Dayjs
    exams?: ListData<ExamModel>
    id?: number
    labHours?: number
    lectureHours?: number
    name?: string
    sections?: ListData<SectionModel>
    semester?: SingleData<SemesterModel>
    startDate?: string | Dayjs
    subject?: SingleData<SubjectModel>
}

export interface CourseCreateRequestModel
    extends Omit<
        CourseModel,
        'subject' | 'classes' | 'sections' | 'semester' | 'exams'
    > {
    classes?: number[]
    exams?: number[]
    sections?: SectionModel[]
    semester?: number | null
    subject?: number
}

export enum CourseType {
    OPTIONAL = 'OPTIONAL',
    REQUIRED = 'REQUIRED',
}
