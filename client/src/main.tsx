import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './Context/Auth_context.tsx'
import { Provider } from 'react-redux'
import store from './redux/shop.ts'


const routers = createBrowserRouter(router);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>

        <RouterProvider router={routers} />

      </AuthProvider>
    </Provider>
      
  </StrictMode>,
)
