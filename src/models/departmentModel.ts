import { BaseModel } from './baseModel'
import { ImageModel } from './imageModel'

export interface DepartmentModel extends BaseModel {
    avatar?: ImageModel | string | null
    classes?: unknown
    departmentId?: string
    departmentName?: string
    subjects?: unknown
}
