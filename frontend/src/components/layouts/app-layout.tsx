import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useLoginRedirect } from '@/hooks/use-login-redirect';
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

import { GalleryVerticalEnd, icons, Search } from 'lucide-react';

import Breadcrumb from '@/components/breadcrumb';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { paths } from '@/lib/paths';
import { cn } from '@/lib/utils';

declare module 'csstype' {
  interface Properties {
    [index: string]: any;
  }
}

const navLinks = [
  {
    pathname: paths.app.app.href,
    to: paths.app.app.href,
    icon: 'Gauge',
    label: paths.app.app.description,
  },
  {
    pathname: paths.app.transactions.href,
    to: `${paths.app.transactions.href}?sortBy=date&sortDirection=desc`,
    icon: 'Receipt',
    label: paths.app.transactions.description,
  },
  {
    pathname: paths.app.schedules.href,
    to: paths.app.schedules.href,
    icon: 'CalendarDays',
    label: paths.app.schedules.description,
  },
  {
    pathname: paths.app.categories.href,
    to: paths.app.categories.href,
    icon: 'FolderTree',
    label: paths.app.categories.description,
  },
  {
    pathname: paths.app.accounts.href,
    to: paths.app.accounts.href,
    icon: 'Wallet',
    label: paths.app.accounts.description,
  },
  {
    pathname: paths.app.tags.href,
    to: paths.app.tags.href,
    icon: 'Tag',
    label: paths.app.tags.description,
  },
];

export const AppLayout = () => {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  const to = useLoginRedirect();
  const location = useLocation();

  if (!auth.isAuthenticated || !user) {
    return <Navigate to={to} replace />;
  }

  const logout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '12rem',
        '--sidebar-width-mobile': '20rem',
      }}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Expenses</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navLinks.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton tooltip={item.label} asChild>
                      <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                          'flex items-center font-semibold gap-3',
                          location.pathname === item.pathname
                            ? 'text-primary bg-sidebar-accent'
                            : '',
                        )}
                      >
                        <Icon name={item.icon as keyof typeof icons} />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex top-0 h-16 bg-background shrink-0 items-center gap-2 px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb />
          </div>
          <div className="ml-auto px-3 flex gap-2">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar>
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback>UR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app/support">Support</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
