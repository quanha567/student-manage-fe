import React from 'react';

import ReactDOM from 'react-dom/client';

import { RouterProvider, ThemeConfigProvider } from '@/providers';

import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeConfigProvider>
      <RouterProvider />
    </ThemeConfigProvider>
  </React.StrictMode>,
);
