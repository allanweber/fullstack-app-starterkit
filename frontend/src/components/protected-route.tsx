import { useLoginRedirect } from '@/hooks/use-login-redirect';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

type RouteProps = {
  Component: React.ComponentType;
  [x: string]: any;
};

export function ProtectedRoute({ Component, ...rest }: RouteProps) {
  const authState = useAuth();
  const to = useLoginRedirect();

  return authState.isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to={to} replace />
  );
}
