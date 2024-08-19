import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSignOut } from '../services/authentication';

export const AppLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useSignOut();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname}${encodeURIComponent(
          location.search
        )}`}
      />
    );
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          auth.logout();
          navigate('/');
        },
        onError: (error) => {
          console.error('Error logging out: ', error);
        },
      });
    }
  };

  return (
    <div className="root-layout" style={{ margin: '10px 10px 10px 10px' }}>
      <header>
        <p>{auth.user}</p>
        <p>
          <NavLink
            className="underline underline-offset-4 hover:text-primary"
            to="/app"
          >
            Dashboard
          </NavLink>
        </p>
        <p>
          <NavLink
            className="underline underline-offset-4 hover:text-primary"
            to="/app/invoices"
          >
            Invoices
          </NavLink>
        </p>
        <div>
          <button
            type="button"
            className="hover:underline"
            onClick={handleLogout}
          >
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
