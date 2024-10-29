import { AuthLayout } from "@/layouts/AuthLayout";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { RootLayout } from "../layouts/RootLayout";
import NotFound from "./NotFound";

import { LoadingSpinner } from "@/components/LoadingSpinner ";
import { lazy, ReactNode, Suspense } from "react";

const rootPages = [
  { path: "/", Comp: lazy(() => import("./Index")) },
  { path: "/about", Comp: lazy(() => import("./About")) },
];

const authPages = [
  { path: "/login", Comp: lazy(() => import("./auth/Login")) },
  { path: "/register", Comp: lazy(() => import("./auth/Register")) },
  { path: "/forgot-password", Comp: lazy(() => import("./auth/ForgotPassword")) },
  { path: "/verify-email", Comp: lazy(() => import("./auth/VerifyRegistration")) },
];

const appPages = [
  { path: "", Comp: lazy(() => import("./app")) },
  { path: "transactions", Comp: lazy(() => import("./app/transactions")) },
  { path: "categories", Comp: lazy(() => import("./app/categories")) },
  { path: "schedules", Comp: lazy(() => import("./app/schedules")) },
  { path: "settings", Comp: lazy(() => import("./app/settings")) },
  { path: "support", Comp: lazy(() => import("./app/support")) },
];

const SuspenseRoute = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mb-5">
          <LoadingSpinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        {rootPages.map(({ path, Comp }, index) => (
          <Route
            key={`landing-${index}`}
            path={path}
            element={
              <SuspenseRoute>
                <Comp />
              </SuspenseRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFound to="/" />} />
      </Route>
      <Route element={<AuthLayout />}>
        {authPages.map(({ path, Comp }, index) => (
          <Route
            key={`auth-${index}`}
            path={path}
            element={
              <SuspenseRoute>
                <Comp />
              </SuspenseRoute>
            }
          />
        ))}
      </Route>
      <Route path="app" element={<ProtectedRoute Component={AppLayout} />}>
        {appPages.map(({ path, Comp }, index) => (
          <Route
            key={`app-${index}`}
            path={path}
            element={
              <SuspenseRoute>
                <Comp />
              </SuspenseRoute>
            }
          />
        ))}
        <Route path="*" element={<NotFound to="/app" />} />
      </Route>
    </>
  )
);
