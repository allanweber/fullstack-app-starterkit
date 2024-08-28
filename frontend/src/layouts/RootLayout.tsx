import { Navbar } from "@/components/landing/NavBar";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
