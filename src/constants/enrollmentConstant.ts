import { EnrollmentStatus } from '@/models'

export const ENROLLMENTS_STATUSES: Record<
    EnrollmentStatus,
    { label: string; color: string }
> = {
    COMPLETED: {
        label: 'Hoàn thành',
        color: 'green',
    },
    DROPPED: {
        label: 'Đã xóa',
        color: 'red',
    },
    LEARNING: {
        label: 'Đang học',
        color: 'blue',
    },
    REGISTERED: {
        label: 'Chờ xác nhận',
        color: 'orange',
    },
}
