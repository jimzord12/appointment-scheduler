import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  RouterProvider,
} from '@tanstack/react-router';

import { AppLayout } from '../components/layout/AppLayout.js';
import { hasManagerRole, isAuthenticated } from '../lib/auth.js';
import { AppointmentsPage } from '../pages/Appointments.js';
import { BookAppointmentPage } from '../pages/BookAppointment.js';
import { DashboardPage } from '../pages/Dashboard.js';
import { Home } from '../pages/Home.js';
import { LoginPage } from '../pages/Login.js';
import { ManagerAppointmentsPage } from '../pages/ManagerAppointments.js';
import { ProfilePage } from '../pages/Profile.js';
import { RegisterPage } from '../pages/Register.js';
import { ServiceDetailsPage } from '../pages/ServiceDetails.js';
import { ServicesPage } from '../pages/Services.js';

const rootRoute = createRootRoute({ component: AppLayout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' });
  },
  component: DashboardPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' });
  },
  component: ServicesPage,
});

const serviceDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services/$id',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' });
  },
  component: ServiceDetailsPage,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' });
  },
  component: AppointmentsPage,
});

const bookAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments/book',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' });
  },
  component: BookAppointmentPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' });
  },
  component: ProfilePage,
});

const managerAppointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager/appointments',
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: '/login' });
    if (!hasManagerRole()) throw redirect({ to: '/dashboard' });
  },
  component: ManagerAppointmentsPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  servicesRoute,
  serviceDetailsRoute,
  appointmentsRoute,
  bookAppointmentRoute,
  profileRoute,
  managerAppointmentsRoute,
  loginRoute,
  registerRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
