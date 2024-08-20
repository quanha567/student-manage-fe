import { Dayjs } from 'dayjs'

import { BaseModel } from './baseModel'
import { CourseModel } from './courseModel'

export interface SectionModel extends BaseModel {
    capacity?: number
    code?: string
    course?: CourseModel
    id?: number
    schedules?: SectionSchedule[]
}

export interface SectionCreateRequestModel
    extends Omit<SectionModel, 'course'> {
    course?: number
}

export interface SectionSchedule {
    day?: string
    endTime?: string | Dayjs
    id?: number
    room?: string
    startTime?: string | Dayjs
}
