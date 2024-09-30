import { AxiosProgressEvent } from 'axios'

import { API_URL } from '@/constants'
import { ImageData } from '@/models'

import { axiosService } from './axiosService'

export const fileService = {
    uploadFiles: (
        data: FormData,
        onUploadProgress?:
            | ((progressEvent: AxiosProgressEvent) => void)
            | undefined,
    ): Promise<ImageData[]> => {
        return axiosService()<ImageData[]>({
            url: API_URL.UPLOAD,
            method: 'POST',
            data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
