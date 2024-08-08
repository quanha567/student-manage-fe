import { DefaultOptionType } from 'antd/es/cascader'

import { CourseType } from '@/models'

export const COURSE_TYPES: Record<CourseType, string> = {
    OPTIONAL: 'Tự chọn',
    REQUIRED: 'Bắt buộc',
}

export const COURSE_TYPE_OPTIONS: DefaultOptionType[] = Object.entries(
    COURSE_TYPES,
).map(([key, value]) => ({
    label: value,
    value: key,
}))
