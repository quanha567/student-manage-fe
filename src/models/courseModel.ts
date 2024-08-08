import { Dayjs } from 'dayjs'

import { SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { SubjectModel } from './subjectModel'

export interface CourseModel extends BaseModel {
    code?: string
    courseType?: CourseType
    credits?: number
    endDate?: string | Dayjs
    name?: string
    practiceCount?: number
    startDate?: string | Dayjs
    subject?: SingleData<SubjectModel>
    theoryCount?: number
}

export interface CourseCreateRequestModel extends Omit<CourseModel, 'subject'> {
    subject: number
}

export enum CourseType {
    OPTIONAL = 'OPTIONAL',
    REQUIRED = 'REQUIRED',
}
