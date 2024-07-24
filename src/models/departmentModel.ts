import { BaseModel } from './baseModel'
import { ImageModel } from './imageModel'

export interface DepartmentModel extends BaseModel {
    avatar?: ImageModel
    classes?: unknown
    departmentId?: string
    departmentName?: string
    subjects?: unknown
}
