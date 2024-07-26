import { ListData } from '@/types'

import { BaseModel } from './baseModel'
import { ClassModel } from './classModel'
import { ImageModel } from './imageModel'

export interface DepartmentModel extends BaseModel {
    avatar?: ImageModel | string | null
    classes?: ListData<ClassModel>
    departmentId?: string
    departmentName?: string
    subjects?: unknown
}
