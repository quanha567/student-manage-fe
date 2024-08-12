import { BaseModel } from './baseModel'
import { CourseModel } from './courseModel'

export interface SectionModel extends BaseModel {
    capacity?: number
    classroom?: string
    code?: string
    course?: CourseModel
    id?: number
    schedule?: string[]
    schedules?: SectionSchedule[]
}

export interface SectionCreateRequestModel
    extends Omit<SectionModel, 'course'> {
    course?: number
}

export interface SectionSchedule {
    day?: string
    endTime?: string
    id?: number
    startTime?: string
}
