import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type RouteProps = {
  Component: React.ComponentType;
  [x: string]: any;
};

export function ProtectedRoute({ Component, ...rest }: RouteProps) {
  const authState = useAuth();

  return authState.isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
}
