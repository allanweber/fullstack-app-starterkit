import { useLoginRedirect } from "@/hooks/useLoginRedirect";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AppLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const to = useLoginRedirect();

  if (!auth.isAuthenticated) {
    return <Navigate to={to} replace />;
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      auth.logout();
      navigate("/");
    }
  };

  return (
    <div className="root-layout" style={{ margin: "10px 10px 10px 10px" }}>
      <header>
        <p>{auth.user?.name}</p>
        <p>
          <NavLink className="underline underline-offset-4 hover:text-primary" to="/app">
            Dashboard
          </NavLink>
        </p>
        <p>
          <NavLink className="underline underline-offset-4 hover:text-primary" to="/app/invoices">
            Invoices
          </NavLink>
        </p>
        <div>
          <button type="button" className="hover:underline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
