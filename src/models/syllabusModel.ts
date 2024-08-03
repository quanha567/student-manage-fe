import { SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { ImageModel } from './imageModel'
import { SubjectModel } from './subjectModel'

export interface SyllabusModel extends BaseModel {
    description?: string
    files?: ImageModel
    name: string
    subject?: SingleData<SubjectModel>
}

export interface SyllabusCreateModel {
    description?: string
    files?: unknown
    name: string
}
