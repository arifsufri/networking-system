import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { EventsView } from 'src/sections/eventsblog/view/events-view';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ProtectedRoute } from './protected-route';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const CreateEventPage = lazy(() => import('src/pages/events/create'));
export const EventsPage = lazy(() => import('src/pages/events'));
export const EventParticipantsPage = lazy(() => import('src/pages/event-participants/[id]'));
export const ParticipantsPage = lazy(() => import('src/pages/participants'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = localStorage.getItem('currentUser');
  const userRole = currentUser ? JSON.parse(currentUser).role2 : null;
  
  if (userRole !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/sign-in" replace />,
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      ),
    },
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { path: 'dashboard', element: <HomePage /> },
        { 
          path: 'user', 
          element: (
            <ProtectedAdminRoute>
              <UserPage />
            </ProtectedAdminRoute>
          ) 
        },
        { path: 'products', element: <ProductsPage /> },
        { path: 'events', element: <EventsView /> },
        { 
          path: 'events/create', 
          element: (
            <ProtectedAdminRoute>
              <CreateEventPage />
            </ProtectedAdminRoute>
          ) 
        },
        { path: 'blog', element: <BlogPage /> },
        {
          path: 'event-participants/:id',
          element: <EventParticipantsPage />,
        },
        { path: 'participants', element: <ParticipantsPage /> },
      ],
    },
  ]);
}
