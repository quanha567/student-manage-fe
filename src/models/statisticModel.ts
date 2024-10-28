export interface SummaryReportResponse {
    classCount?: number
    departmentCount?: number
    studentCount?: number
    teacherCount?: number
}

export interface ChartReportResponse {
    backgroundColor?: string[]
    borderColor?: string[]
    data?: number[]
    labels?: string[]
}
