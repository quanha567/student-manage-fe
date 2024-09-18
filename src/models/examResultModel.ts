import { ListData, SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { ExamModel } from './examModel'
import { StudentModel } from './studentModel'

export interface ExamResultModel extends BaseModel {
    exam?: SingleData<ExamModel>
    score?: number
    students?: ListData<StudentModel>
}
