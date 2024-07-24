import { ENV_CONFIGS } from '@/configs'

export const createApiURL = (subPath: string) =>
    `${ENV_CONFIGS.BASE_URL}/api/${subPath}`
