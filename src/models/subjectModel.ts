import { ListData } from '@/types'

import { BaseModel } from './baseModel'
import { CourseModel } from './courseModel'
import { SyllabusModel } from './syllabusModel'

export interface SubjectModel extends BaseModel {
    code?: string
    courses?: ListData<CourseModel>
    description?: string
    name?: string
    syllabuses?: ListData<SyllabusModel>
}

export interface SubjectCreateModel {
    description?: string
    name: string
    syllabuses?: number[]
}
