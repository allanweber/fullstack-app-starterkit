import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { RootLayout } from "../layouts/RootLayout";
import { About } from "./About";
import { Dashboard } from "./app/dashboard";

import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { InvoiceId } from "./app/InvoiceId";
import { Invoices } from "./app/Invoices";
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
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyRegistration />} />
      </Route>
      <Route path="app" element={<ProtectedRoute Component={AppLayout} />}>
        <Route index element={<ProtectedRoute Component={Dashboard} />} />
        <Route path="invoices" element={<ProtectedRoute Component={Invoices} />}>
          <Route path=":invoiceId" element={<ProtectedRoute Component={InvoiceId} />} />
        </Route>
      </Route>
    </>
  )
);
