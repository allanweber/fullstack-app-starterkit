import { AuthLayout } from "@/layouts/AuthLayout";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { RootLayout } from "../layouts/RootLayout";
import { About } from "./About";
import Categories from "./app/categories";
import { Dashboard } from "./app/Dashboard";
import Schedules from "./app/schedules";
import Settings from "./app/Settings";
import Support from "./app/Support";
import Transactions from "./app/transactions";
import { ForgotPassword } from "./auth/ForgotPassword";
import { LoginPage } from "./auth/Login";
import { RegisterPage } from "./auth/Register";
import { VerifyRegistration } from "./auth/VerifyRegistration";
import { Index } from "./Index";
import { NotFound } from "./NotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        <Route index element={<Index />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound to="/" />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyRegistration />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="app" element={<ProtectedRoute Component={AppLayout} />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="categories" element={<Categories />} />
        <Route path="schedules" element={<Schedules />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
        <Route path="*" element={<NotFound to="/app" />} />
      </Route>
    </>
  )
);
