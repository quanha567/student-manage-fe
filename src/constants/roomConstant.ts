import { RoomType } from '@/models'

export const ROOM_TYPES: Record<RoomType, string> = {
    AUDITORIUM: 'Hội trường',
    CLASSROOM: 'Phòng học',
    LABORATORY: 'Phòng thí nghiệm',
    OFFICE: 'Văn phòng',
}

export const ROOM_TYPE_OPTIONS = Object.entries(ROOM_TYPES).map(
    ([key, value]) => ({
        value: key,
        label: value,
    }),
)
