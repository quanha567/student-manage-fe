import { Dayjs } from 'dayjs'

import { SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { CourseModel } from './courseModel'
import { ExamModel } from './examModel'
import { RoomModel } from './roomModel'
import { StudentModel } from './studentModel'
import { TeacherModel } from './teacherModel'
export interface SectionModel extends BaseModel {
    capacity?: number
    code?: string
    course?: CourseModel
    id?: number
    schedules?: SectionSchedule[]
    teacher?: SingleData<TeacherModel>
}

export interface SectionCreateRequestModel
    extends Omit<SectionModel, 'course' | 'teacher'> {
    course?: number
    teacher?: number
}

export interface SectionSchedule {
    day?: string
    endTime?: string | Dayjs
    id?: number
    room?: SingleData<RoomModel>
    startTime?: string | Dayjs
}

type SectionPointData = StudentModel & Record<string, number | null>

export interface SectionPointResponse {
    data?: SectionPointData
    exams?: ExamModel[]
}
