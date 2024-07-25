import { Data } from '@/types'

export interface ImageModel {
    data?: Data<ImageData> | Data<ImageData[]>
}

export interface ImageData {
    alternativeText?: string
    caption?: string
    createdAt?: string
    ext?: string
    formats?: ImageFormat
    hash?: string
    height?: number
    id?: string
    mime?: string
    name?: string
    previewUrl?: string
    provider?: string
    provider_metadata?: null
    size?: number
    updatedAt?: string
    url?: string
    width?: number
}

export interface ImageFormat {
    large?: ImageFormatData
    medium?: ImageFormatData
    small?: ImageFormatData
    thumbnail?: ImageFormatData
}

export interface ImageFormatData {
    ext?: string
    hash?: string
    height?: number
    mime?: string
    name?: string
    path?: string
    size?: number
    sizeInBytes?: number
    url?: string
    width?: number
}
