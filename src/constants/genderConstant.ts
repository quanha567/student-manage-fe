import { DefaultOptionType } from 'antd/es/select'

import { Gender } from '@/models'

export const GENDERS: Record<Gender, string> = {
    FEMALE: 'Nữ',
    MALE: 'Nam',
    OTHER: 'Khác',
}

export const GENDER_OPTIONS: DefaultOptionType[] = Object.entries(GENDERS).map(
    ([key, value]) => ({
        label: value,
        value: key,
    }),
)
