import { ListData } from '@/types'

import { BaseModel } from './baseModel'
import { ClassModel } from './classModel'
import { ImageModel } from './imageModel'

export interface DepartmentModel extends BaseModel {
    avatar?: ImageModel
    classes?: ListData<ClassModel>
    departmentId?: string
    departmentName?: string
    subjects?: unknown
}

export interface DepartmentRequestModel {
    avatar?: unknown
    classes?: number[]
    departmentName?: string
}
