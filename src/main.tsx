import React from 'react'

import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RouterProvider, ThemeConfigProvider } from '@/providers'

import '@/index.css'

export const queryClient: QueryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeConfigProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider />
            </QueryClientProvider>
        </ThemeConfigProvider>
    </React.StrictMode>,
)
