import { Dayjs } from 'dayjs'

import { ListData, SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { ClassModel } from './classModel'
import { SectionModel } from './sectionModel'
import { SubjectModel } from './subjectModel'

export interface CourseModel extends BaseModel {
    classes?: ListData<ClassModel>
    code?: string
    courseType?: CourseType
    credits?: number
    endDate?: string | Dayjs
    id?: number
    labHours?: number
    lectureHours?: number
    name?: string
    sections?: ListData<SectionModel>
    semester?: string
    startDate?: string | Dayjs
    subject?: SingleData<SubjectModel>
}

export interface CourseCreateRequestModel
    extends Omit<CourseModel, 'subject' | 'classes' | 'sections'> {
    classes?: number[]
    sections?: SectionModel[]
    subject?: number
}

export enum CourseType {
    OPTIONAL = 'OPTIONAL',
    REQUIRED = 'REQUIRED',
}
