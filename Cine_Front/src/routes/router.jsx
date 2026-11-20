import { createBrowserRouter } from 'react-router-dom';
import PlaceholderPage from '../components/common/PlaceholderPage.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ClientLayout from '../layouts/ClientLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import MovieDetailPage from '../pages/public/MovieDetailPage.jsx';
import DashboardPage from '../pages/admin/DashboardPage.jsx';
import MoviesPage from '../pages/admin/MoviesPage.jsx';
import NewMoviePage from '../pages/admin/NewMoviePage.jsx';
import ShowtimesPage from '../pages/admin/ShowtimesPage.jsx';
import NewShowtimePage from '../pages/admin/NewShowtimePage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import SeatSelectionPage from '../pages/client/SeatSelectionPage.jsx';
import ReservationsPage from '../pages/shared/ReservationsPage.jsx';
import InvoicesPage from '../pages/shared/InvoicesPage.jsx';

const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/pelicula/:id',
        element: <MovieDetailPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute role='Client' />,
    children: [
      {
        element: <ClientLayout />,
        children: [
          { path: '/cliente/reservas', element: <ReservationsPage /> },
          { path: '/cliente/reservas/:id', element: <ReservationsPage /> },
          {
            path: '/cliente/reservar/:funcionId',
            element: <SeatSelectionPage />,
          },
          {
            path: '/cliente/mis-compras',
            element: <InvoicesPage />,
          },
          { path: '/cliente/facturas', element: <InvoicesPage /> },
          { path: '/cliente/facturas/:id', element: <InvoicesPage /> },
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
            element: <DashboardPage />,
          },
          {
            path: '/admin/peliculas',
            element: <MoviesPage />,
          },
          {
            path: '/admin/peliculas/nueva',
            element: <NewMoviePage />,
          },
          {
            path: '/admin/funciones',
            element: <ShowtimesPage />,
          },
          {
            path: '/admin/funciones/nueva',
            element: <NewShowtimePage />,
          },
          { path: '/admin/reservas', element: <ReservationsPage /> },
          { path: '/admin/reservas/:id', element: <ReservationsPage /> },
          { path: '/admin/facturas', element: <InvoicesPage /> },
          { path: '/admin/facturas/:id', element: <InvoicesPage /> },
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
