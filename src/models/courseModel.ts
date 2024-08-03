import { SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { SubjectModel } from './subjectModel'

export interface CourseModel extends BaseModel {
    code?: string
    credits?: number
    name?: string
    practiceCount?: number
    subject?: SingleData<SubjectModel>
    theoryCount?: number
}
