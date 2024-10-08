import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        tsconfigPaths(),
        svgr({
            exportAsDefault: true,
            svgrOptions: {
                icon: true,
                dimensions: false,
            },
        }),
    ],
    server: {
        port: 1311,
    },
})
