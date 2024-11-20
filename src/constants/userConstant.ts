import { DefaultOptionType } from 'antd/es/select'

import { UserStatus } from '@/models'

export const USER_STATUSES: Record<UserStatus, string> = {
    LEARNING: 'Đang theo học',
    FINISHED: 'Đã hoàn thành',
    PAUSED: 'Đang tạm hoãn',
    ENDED: 'Đã kết thúc',
}

export const USER_STATUS_OPTIONS: DefaultOptionType[] = Object.entries(
    USER_STATUSES,
).map(([key, value]) => ({
    label: value,
    value: key,
}))
