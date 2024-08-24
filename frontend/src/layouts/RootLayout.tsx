import { ModeToggle } from "@/components/theme-toggle";
import { NavLink, Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div>
      <header>
        <nav>
          <p>
            <ModeToggle />
          </p>
          <p>
            <NavLink className="underline underline-offset-4 hover:text-primary" to="/">
              Home
            </NavLink>
          </p>
          <p>
            <NavLink className="underline underline-offset-4 hover:text-primary" to="/login">
              Login
            </NavLink>
          </p>
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
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
