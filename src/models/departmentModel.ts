import { BaseModel } from './baseModel'

export interface DepartmentModel extends BaseModel {
    classes?: unknown
    departmentId?: string
    departmentName?: string
    subjects?: unknown
}
