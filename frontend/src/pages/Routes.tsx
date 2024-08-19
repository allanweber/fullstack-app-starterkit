import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { RootLayout } from '../layouts/RootLayout';
import { About } from './About';
import { Dashboard } from './app/dashboard';

import { InvoiceId } from './app/InvoiceId';
import { Invoices } from './app/Invoices';
import { Index } from './Index';
import { Login } from './Login';
import { NotFound } from './NotFound';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Index />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="invoices"  element={<Invoices />}>
          <Route path=":invoiceId" element={<InvoiceId/>} />
        </Route>
      </Route>
    </>
  )
);
