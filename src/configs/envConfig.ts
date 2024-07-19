interface EnvConfigType {
    BASE_URL: string
}

export const ENV_CONFIGS: EnvConfigType = {
    BASE_URL: String(import.meta.env.VITE_BASE_URL || ''),
}
