import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import '@/index.css'
import { QueryProvider, RouterProvider, ThemeConfigProvider } from '@/providers'
import { store } from '@/redux'

Chart.register(CategoryScale)

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <Provider store={store}>
        <ThemeConfigProvider>
            <QueryProvider>
                <RouterProvider />
            </QueryProvider>
        </ThemeConfigProvider>
    </Provider>,
    // </React.StrictMode>,
)
