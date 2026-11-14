import { createBrowserRouter } from 'react-router-dom';
import PlaceholderPage from '../components/common/PlaceholderPage.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ClientLayout from '../layouts/ClientLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import HomePage from '../pages/public/HomePage.jsx';

const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/pelicula/:id',
        element: <PlaceholderPage title='Detalle de película' />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <PlaceholderPage title='Iniciar sesión' /> }],
  },
  {
    element: <ProtectedRoute role='Client' />,
    children: [
      {
        element: <ClientLayout />,
        children: [
          { path: '/cliente/reservas', element: <PlaceholderPage title='Mis reservas' /> },
          {
            path: '/cliente/reservar/:funcionId',
            element: <PlaceholderPage title='Reserva de función' />,
          },
          {
            path: '/cliente/mis-compras',
            element: <PlaceholderPage title='Mis compras' />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute role='Admin' />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin/dashboard',
            element: <PlaceholderPage title='Dashboard' />,
          },
          {
            path: '/admin/peliculas',
            element: <PlaceholderPage title='Películas' />,
          },
          {
            path: '/admin/peliculas/nueva',
            element: <PlaceholderPage title='Nueva película' />,
          },
          {
            path: '/admin/funciones',
            element: <PlaceholderPage title='Funciones' />,
          },
          {
            path: '/admin/funciones/nueva',
            element: <PlaceholderPage title='Nueva función' />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <PlaceholderPage title='Página no encontrada' />,
  },
]

if (import.meta.env.DEV) {
  routes.push({
    path: '/__dev/components',
    lazy: async () => {
      const { default: ComponentShowcase } = await import(
        '../pages/ComponentShowcase.jsx'
      )

      return { Component: ComponentShowcase }
    },
  })
}

export const router = createBrowserRouter(routes)
