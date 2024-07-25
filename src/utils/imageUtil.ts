import { ENV_CONFIGS } from '@/configs'
import { ImageData, ImageModel } from '@/models'

export const getPreviewUrl = (imageModel?: ImageModel): string => {
    const data = imageModel?.data

    if (!data || !('attributes' in data)) {
        return ''
    }

    const attributes = data.attributes as ImageData

    const formats = attributes.formats

    const { thumbnail, small, medium, large } = formats ?? {}

    return `${ENV_CONFIGS.BASE_URL}${
        thumbnail?.url ??
        small?.url ??
        medium?.url ??
        large?.url ??
        attributes.previewUrl ??
        attributes.url ??
        ''
    }`
}
