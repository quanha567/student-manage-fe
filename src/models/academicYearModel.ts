import { SingleData } from '@/types'

import { BaseModel } from './baseModel'
import { SemesterModel } from './semesterModel'

export interface AcademicYearModel extends BaseModel {
    name: string
    semesters?: SingleData<SemesterModel>
}
