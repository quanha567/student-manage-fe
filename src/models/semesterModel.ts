import { Dayjs } from 'dayjs'

import { ListData } from '@/types'

import { BaseModel } from './baseModel'
import { ClassModel } from './classModel'
import { CourseModel } from './courseModel'

export interface SemesterModel extends BaseModel {
    classes?: ListData<ClassModel>
    courses?: ListData<CourseModel>
    endDate?: string | Date | Dayjs
    name?: string
    startDate?: string | Date | Dayjs
}

export type SemesterCreateRequestModel = Required<
    Pick<SemesterModel, 'name' | 'startDate' | 'endDate'>
> & {
    classes?: number[]
    courses?: number[]
}
