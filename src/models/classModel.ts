import { ListData, SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { DepartmentModel } from './departmentModel'
import { StudentModel } from './studentModel'
import { TeacherModel } from './teacherModel'

export interface ClassModel extends BaseModel {
    classId?: string
    className?: string
    department?: SingleData<DepartmentModel>
    students?: ListData<StudentModel>
    teacher?: SingleData<TeacherModel>
}
