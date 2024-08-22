import { useLoginRedirect } from "@/hooks/useLoginRedirect";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type RouteProps = {
  Component: React.ComponentType;
  [x: string]: any;
};

export function ProtectedRoute({ Component, ...rest }: RouteProps) {
  const authState = useAuth();
  const to = useLoginRedirect();

  return authState.isAuthenticated ? <Component {...rest} /> : <Navigate to={to} replace />;
}
