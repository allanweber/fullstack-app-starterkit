import { Navbar } from '@/components/landing/bavbar';
import { Outlet } from 'react-router-dom';

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
