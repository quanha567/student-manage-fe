import { Dayjs } from 'dayjs'

import { ListData, SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { CourseModel } from './courseModel'
import { ExamResultModel } from './examResultModel'

export interface ExamModel extends BaseModel {
    course?: SingleData<CourseModel>
    examDate?: string
    examName?: string
    examResult?: ListData<ExamResultModel>
    id?: number
    type?: ExamType
}

export enum ExamType {
    FIFTEEN_MINUTE = 'FIFTEEN_MINUTE',
    FINALS = 'FINALS',
    FORTY_FIVE_MINUTE = 'FORTY_FIVE_MINUTE',
    MID_TERM = 'MID_TERM',
}

export interface ExamCreateRequestModel {
    course: number
    examDate: Date | string | Dayjs
    examName: string
    type: ExamType
}
