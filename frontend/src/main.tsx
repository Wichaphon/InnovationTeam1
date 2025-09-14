import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from '@/app/routes.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AppProviders } from './app/providers.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
)
