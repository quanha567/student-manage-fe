import { DefaultOptionType } from 'antd/es/cascader'

import { ExamType } from '@/models'

export const EXAM_TYPE_NAMES: Record<ExamType, string> = {
    FIFTEEN_MINUTE: 'Kiểm tra 15 phút',
    FORTY_FIVE_MINUTE: 'Kiểm tra 45 phút',
    MID_TERM: 'Thi giữa kỳ',
    FINALS: 'Thi cuối kỳ',
}

export const EXAM_TYPE_OPTIONS: DefaultOptionType[] = Object.entries(
    EXAM_TYPE_NAMES,
).map(([key, value]) => ({
    label: value,
    value: key,
}))
