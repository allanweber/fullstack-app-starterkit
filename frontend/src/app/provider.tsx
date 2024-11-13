import { AuthProvider } from '@/components/auth-provider';
import { MainErrorFallback } from '@/components/errors/main';
import { Spinner } from '@/components/spinner';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryConfig } from '@/lib/react-query';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
        queryCache: new QueryCache({
          onError: (error) => {
            console.error('THIS IS THE ERROR', error);
            if (error.message === '401' || error.message === 'Unauthorized') {
              window.location.href = '/login';
            }
          },
        }),
      }),
  );

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ThemeProvider defaultTheme="system" storageKey="expenses-ui-theme">
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TooltipProvider>
                <div className="bg-muted/40 min-h-screen w-full">
                  {children}
                </div>
              </TooltipProvider>
            </AuthProvider>
            {import.meta.env.DEV && (
              <ReactQueryDevtools buttonPosition="bottom-left" />
            )}
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Suspense>
  );
};
