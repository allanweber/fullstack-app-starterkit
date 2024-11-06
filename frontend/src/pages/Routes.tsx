import { AuthLayout } from '@/components/layouts/auth-layout';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { AppLayout } from '../components/layouts/app-layout';
import { RootLayout } from '../components/layouts/root-layout';
import { ProtectedRoute } from '../components/protected-route';
import NotFound from './not-found';

import { LoadingSpinner } from '@/components/loading-spinner';
import { lazy, ReactNode, Suspense } from 'react';

const rootPages = [
  { path: '/', Comp: lazy(() => import('./')) },
  { path: '/about', Comp: lazy(() => import('./about')) },
];

const authPages = [
  { path: '/login', Comp: lazy(() => import('./auth/login')) },
  { path: '/register', Comp: lazy(() => import('./auth/register')) },
  {
    path: '/forgot-password',
    Comp: lazy(() => import('./auth/forgot-password')),
  },
  {
    path: '/verify-email',
    Comp: lazy(() => import('./auth/verify-registration')),
  },
];

const appPages = [
  { path: '', Comp: lazy(() => import('./app')) },
  { path: 'transactions', Comp: lazy(() => import('./app/transactions')) },
  { path: 'categories', Comp: lazy(() => import('./app/categories')) },
  { path: 'schedules', Comp: lazy(() => import('./app/schedules')) },
  { path: 'settings', Comp: lazy(() => import('./app/settings')) },
  { path: 'support', Comp: lazy(() => import('./app/support')) },
];

const SuspenseRoute = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mb-5">
          <LoadingSpinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        {rootPages.map(({ path, Comp }, index) => (
          <Route
            key={`landing-${index}`}
            path={path}
            element={
              <SuspenseRoute>
                <Comp />
              </SuspenseRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFound to="/" />} />
      </Route>
      <Route element={<AuthLayout />}>
        {authPages.map(({ path, Comp }, index) => (
          <Route
            key={`auth-${index}`}
            path={path}
            element={
              <SuspenseRoute>
                <Comp />
              </SuspenseRoute>
            }
          />
        ))}
      </Route>
      <Route path="app" element={<ProtectedRoute Component={AppLayout} />}>
        {appPages.map(({ path, Comp }, index) => (
          <Route
            key={`app-${index}`}
            path={path}
            element={
              <SuspenseRoute>
                <Comp />
              </SuspenseRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFound to="/app" />} />
      </Route>
    </>,
  ),
);
