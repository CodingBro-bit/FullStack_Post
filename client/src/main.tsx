import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './Context/Auth_context.tsx'

const routers = createBrowserRouter(router);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>

        <RouterProvider router={routers} />

      </AuthProvider>
  </StrictMode>,
)
