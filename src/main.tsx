import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import '@/index.css'
import { RouterProvider, ThemeConfigProvider } from '@/providers'
import { store } from '@/redux'

Chart.register(CategoryScale)
export const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <Provider store={store}>
        <ThemeConfigProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider />
            </QueryClientProvider>
        </ThemeConfigProvider>
    </Provider>,
    // </React.StrictMode>,
)
