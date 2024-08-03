import { QueryClient, keepPreviousData } from '@tanstack/react-query'

export * from './QueryProvider'
export * from './RouterProvider'
export * from './ThemeConfigProvider'

export const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // refetchOnWindowFocus: false,
            placeholderData: keepPreviousData,
        },
    },
})
