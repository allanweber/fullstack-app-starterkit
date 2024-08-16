import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import React from 'react';
import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary';
import { NotFound } from '../components/NotFound';
import { AuthContext } from '../context/auth';

interface RootContext {
  queryClient: QueryClient;
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>{' '}
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>{' '}
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>{' '}
        <Link to="/invoices" className="[&.active]:font-bold">
          Invoices
        </Link>{' '}
        <Link
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          to="/invalid"
          className="[&.active]:font-bold"
        >
          Invalid
        </Link>
      </div>
      <hr />
      {children}
      {process.env.NODE_ENV === 'development' && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </>
      )}
    </>
  );
}
