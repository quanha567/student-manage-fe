import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import '@/index.css'
import { QueryProvider, RouterProvider, ThemeConfigProvider } from '@/providers'
import { store } from '@/redux'
import { globalLoading, GlobalLoading } from './components'

Chart.register(CategoryScale)

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <Provider store={store}>
        <ThemeConfigProvider>
            <QueryProvider>
                <GlobalLoading ref={globalLoading}>
                    <RouterProvider />
                </GlobalLoading>
            </QueryProvider>
        </ThemeConfigProvider>
    </Provider>,
    // </React.StrictMode>,
)
