import { BaseModel } from './baseModel'
import { SectionModel } from './sectionModel'
import { StudentModel } from './studentModel'

export interface EnrollmentModel extends BaseModel {
    section?: SectionModel
    status?: EnrollmentStatus
    student?: StudentModel
}

export interface EnrollmentCreateModel
    extends Required<Pick<EnrollmentModel, 'status'>> {
    section: number
    student: number
}

export enum EnrollmentStatus {
    COMPLETED = 'COMPLETED',
    DROPPED = 'DROPPED',
    LEARNING = 'LEARNING',
    REGISTERED = 'REGISTERED',
}
