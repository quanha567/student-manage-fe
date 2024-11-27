import { BaseModel } from './baseModel'

export interface RoomModel extends BaseModel {
    capacity?: number
    location?: string
    name?: string
    type?: RoomType
}

export enum RoomType {
    AUDITORIUM = 'AUDITORIUM',
    CLASSROOM = 'CLASSROOM',
    LABORATORY = 'LABORATORY',
    OFFICE = 'OFFICE',
}
