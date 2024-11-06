import { useLocation } from "react-router-dom";

export function useLoginRedirect() {
  const location = useLocation();

  return `/login?redirect=${location.pathname}${encodeURIComponent(location.search)}`;
}
