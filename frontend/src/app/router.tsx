import { AppLayout } from '@/components/layouts/app-layout';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { RootLayout } from '@/components/layouts/root-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { paths } from '@/lib/paths';
import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const createAppRouter = () =>
  createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: paths.home.path,
          lazy: async () => {
            const { Index } = await import('./routes');
            return { Component: Index };
          },
        },
        {
          path: paths.about.path,
          lazy: async () => {
            const { About } = await import('./routes/about');
            return { Component: About };
          },
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: paths.auth.forgotPassword.path,
          lazy: async () => {
            const { ForgotPassword } = await import(
              './routes/auth/forgot-password'
            );
            return { Component: ForgotPassword };
          },
        },
        {
          path: paths.auth.login.path,
          lazy: async () => {
            const { LoginPage } = await import('./routes/auth/login');
            return { Component: LoginPage };
          },
        },
        {
          path: paths.auth.register.path,
          lazy: async () => {
            const { RegisterPage } = await import('./routes/auth/register');
            return { Component: RegisterPage };
          },
        },
        {
          path: paths.auth.verifyEmail.path,
          lazy: async () => {
            const { VerifyEmail } = await import('./routes/auth/verify-email');
            return { Component: VerifyEmail };
          },
        },
      ],
    },
    {
      path: paths.app.app.path,
      element: <ProtectedRoute Component={AppLayout} />,
      children: [
        {
          path: '',
          lazy: async () => {
            const { Dashboard } = await import('./routes/app');
            return { Component: Dashboard };
          },
        },
        {
          path: paths.app.transactions.path,
          lazy: async () => {
            const { Transactions } = await import('./routes/app/transactions');
            return { Component: Transactions };
          },
        },
        {
          path: paths.app.categories.path,
          lazy: async () => {
            const { Categories } = await import('./routes/app/categories');
            return { Component: Categories };
          },
        },
        {
          path: paths.app.schedules.path,
          lazy: async () => {
            const { Schedules } = await import('./routes/app/schedules');
            return { Component: Schedules };
          },
        },
        {
          path: paths.app.settings.path,
          lazy: async () => {
            const { Settings } = await import('./routes/app/settings');
            return { Component: Settings };
          },
        },
        {
          path: paths.app.support.path,
          lazy: async () => {
            const { Support } = await import('./routes/app/support');
            return { Component: Support };
          },
        },
        {
          path: paths.app.accounts.path,
          lazy: async () => {
            const { Accounts } = await import('./routes/app/accounts');
            return { Component: Accounts };
          },
        },
        {
          path: paths.app.tags.path,
          lazy: async () => {
            const { Tags } = await import('./routes/app/tags');
            return { Component: Tags };
          },
        },
      ],
    },

    {
      path: '*',
      lazy: async () => {
        const { NotFound } = await import('./routes/not-found');
        return {
          element: <NotFound to={paths.home.path} />,
        };
      },
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
