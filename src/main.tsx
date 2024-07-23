import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@/index.css'
import { RouterProvider, ThemeConfigProvider } from '@/providers'
import { store } from '@/redux'

export const queryClient: QueryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeConfigProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider />
                </QueryClientProvider>
            </ThemeConfigProvider>
        </Provider>
    </React.StrictMode>,
)
