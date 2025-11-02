import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { ShopLayout } from './shop/layouts/ShopLayout';
import { HomePage } from './shop/pages/home/HomePage';
import { ProductPage } from './shop/pages/product/ProductPage';
import { CategoryPage } from './shop/pages/category/CategoryPage';

import { ServicesPage } from './services/pages/services/ServicesPage';
import { ServiceDetailPage } from './services/pages/service/ServiceDetailPage';

import { AppointmentsPage } from './appointments/pages/appointments/AppointmentsPage';
import { AppointmentDetailPage } from './appointments/pages/appointment/AppointmentDetailPage';
import { NewAppointmentPage } from './appointments/pages/new/NewAppointmentPage';

import { LoginPage } from './auth/pages/login/LoginPage';
import { RegisterPage } from './auth/pages/register/RegisterPage';

import { DashboardPage } from './admin/pages/dashboard/DashboardPage';
import { AdminProductPage } from './admin/pages/product/AdminProductPage';
import { AdminProductsPage } from './admin/pages/products/AdminProductsPage';
import { AdminServicesPage } from './admin/pages/services/AdminServicesPage';
import { AdminServicePage } from './admin/pages/service/AdminServicePage';
import { AdminAppointmentsPage } from './admin/pages/appointments/AdminAppointmentsPage';

import {
  AdminRoute,
  NotAuthenticatedRoute,
  AuthenticatedRoute,
} from '@/auth/components';

const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'));
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));

export const appRouter = createBrowserRouter([
  // Main routes
  {
    path: '/',
    element: <ShopLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'product/:idSlug',
        element: <ProductPage />,
      },
      {
        path: 'category/:category',
        element: <CategoryPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'services/:id',
        element: <ServiceDetailPage />,
      },
    ],
  },

  // Auth Routes
  {
    path: '/auth',
    element: (
      <NotAuthenticatedRoute>
        <AuthLayout />
      </NotAuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },

  // Appointments Routes (requiere autenticación)
  {
    path: '/appointments',
    element: (
      <AuthenticatedRoute>
        <ShopLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <AppointmentsPage />,
      },
      {
        path: 'new',
        element: <NewAppointmentPage />,
      },
      {
        path: ':id',
        element: <AppointmentDetailPage />,
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
      },
      {
        path: 'products/:id',
        element: <AdminProductPage />,
      },
      {
        path: 'services',
        element: <AdminServicesPage />,
      },
      {
        path: 'services/:id',
        element: <AdminServicePage />,
      },
      {
        path: 'appointments',
        element: <AdminAppointmentsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
