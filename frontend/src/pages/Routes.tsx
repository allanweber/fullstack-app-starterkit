import { AuthLayout } from "@/layouts/AuthLayout";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { RootLayout } from "../layouts/RootLayout";
import { Dashboard } from "./app";
import NotFound from "./NotFound";

import { LoadingSpinner } from "@/components/LoadingSpinner ";
import { lazy, ReactNode, Suspense } from "react";
const Index = lazy(() => import("./Index"));
const About = lazy(() => import("./About"));

const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const LoginPage = lazy(() => import("./auth/Login"));
const RegisterPage = lazy(() => import("./auth/Register"));
const VerifyRegistration = lazy(() => import("./auth/VerifyRegistration"));

const Categories = lazy(() => import("./app/categories"));
const Schedules = lazy(() => import("./app/schedules"));
const Settings = lazy(() => import("./app/Settings"));
const Support = lazy(() => import("./app/Support"));
const Transactions = lazy(() => import("./app/transactions"));

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
        <Route
          index
          element={
            <SuspenseRoute>
              <Index />
            </SuspenseRoute>
          }
        />
        <Route
          path="about"
          element={
            <SuspenseRoute>
              <About />
            </SuspenseRoute>
          }
        />
        <Route path="*" element={<NotFound to="/" />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route
          path="login"
          element={
            <SuspenseRoute>
              <LoginPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="register"
          element={
            <SuspenseRoute>
              <RegisterPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <SuspenseRoute>
              <VerifyRegistration />
            </SuspenseRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SuspenseRoute>
              <ForgotPassword />
            </SuspenseRoute>
          }
        />
      </Route>
      <Route path="app" element={<ProtectedRoute Component={AppLayout} />}>
        <Route index element={<Dashboard />} />
        <Route
          path="transactions"
          element={
            <SuspenseRoute>
              <Transactions />
            </SuspenseRoute>
          }
        />
        <Route
          path="categories"
          element={
            <SuspenseRoute>
              <Categories />
            </SuspenseRoute>
          }
        />
        <Route
          path="schedules"
          element={
            <SuspenseRoute>
              <Schedules />
            </SuspenseRoute>
          }
        />
        <Route
          path="settings"
          element={
            <SuspenseRoute>
              <Settings />
            </SuspenseRoute>
          }
        />
        <Route
          path="support"
          element={
            <SuspenseRoute>
              <Support />
            </SuspenseRoute>
          }
        />
        <Route path="*" element={<NotFound to="/app" />} />
      </Route>
    </>
  )
);
