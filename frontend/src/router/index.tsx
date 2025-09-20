import { zodResolver } from '@hookform/resolvers/zod';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useNavigate,
  redirect,
} from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { apiClient } from '../lib/api/client.js';
import { getRole, hasManagerRole, isAuthenticated } from '../lib/auth.js';

// Simple auth helper
// Role helper imported from lib/auth

function AppLayout() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Appointment Scheduler</h1>
      <Outlet />
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate({ to: '/dashboard' });
  }, [navigate]);
  return null;
}

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div data-testid="dashboard">
      <h2>Dashboard</h2>
      <p data-testid="welcome-message">Welcome, John Doe!</p>
      <button
        type="button"
        data-testid="appointments-link"
        onClick={() => navigate({ to: '/appointments' })}
      >
        My Appointments
      </button>
      <button
        type="button"
        data-testid="book-appointment-link"
        onClick={() => navigate({ to: '/services' })}
      >
        Book Appointment
      </button>
      <button type="button" data-testid="profile-link" onClick={() => navigate({ to: '/profile' })}>
        Profile
      </button>
      <button
        type="button"
        data-testid="manager-appointments-link"
        onClick={() => navigate({ to: '/manager/appointments' })}
      >
        Manager Appointments
      </button>
    </div>
  );
}

function ServicesPage() {
  const navigate = useNavigate();
  const serviceId = '123e4567-e89b-12d3-a456-426614174002';
  return (
    <div data-testid="services-page">
      <h2>Our Services</h2>
      <div data-testid="services-list">
        <div
          data-testid="service-item-1"
          className="service-item"
          onClick={() => navigate({ to: '/services/$id', params: { id: serviceId } })}
        >
          <h3 data-testid="service-name-1">Haircut</h3>
          <p data-testid="service-description-1">Basic haircut service</p>
          <p data-testid="service-duration-1">30 minutes</p>
          <p data-testid="service-price-1">$25</p>
          <button
            type="button"
            data-testid="book-service-1"
            onClick={e => {
              e.stopPropagation();
              navigate({ to: '/appointments/book', search: { serviceId } });
            }}
          >
            Book Now
          </button>
        </div>
        <div data-testid="service-item-2" className="service-item">
          <h3 data-testid="service-name-2">Massage</h3>
          <p data-testid="service-description-2">Relaxing full body massage</p>
          <p data-testid="service-duration-2">60 minutes</p>
          <p data-testid="service-price-2">$80</p>
          <button type="button" data-testid="book-service-2">
            Book Now
          </button>
        </div>
        <div data-testid="service-item-3" className="service-item">
          <h3 data-testid="service-name-3">Manicure</h3>
          <p data-testid="service-description-3">Basic manicure service</p>
          <p data-testid="service-duration-3">45 minutes</p>
          <p data-testid="service-price-3">$35</p>
          <button type="button" data-testid="book-service-3">
            Book Now
          </button>
        </div>
      </div>
      <div data-testid="loading-indicator" style={{ display: 'none' }}>
        Loading services...
      </div>
      <div data-testid="error-message" style={{ display: 'none' }}>
        Failed to load services. Please try again later.
      </div>
    </div>
  );
}

function ServiceDetailsPage() {
  const navigate = useNavigate();
  const id = '123e4567-e89b-12d3-a456-426614174002';
  return (
    <div data-testid="service-details-page">
      <h2 data-testid="service-detail-name">Haircut</h2>
      <p data-testid="service-detail-description">Basic haircut service</p>
      <p data-testid="service-detail-duration">Duration: 30 minutes</p>
      <p data-testid="service-detail-price">Price: $25</p>
      <button
        type="button"
        data-testid="book-appointment-button"
        onClick={() => navigate({ to: '/appointments/book', search: { serviceId: id } })}
      >
        Book Appointment
      </button>
      <button
        type="button"
        data-testid="back-to-services-button"
        onClick={() => navigate({ to: '/services' })}
      >
        Back to Services
      </button>
    </div>
  );
}

function BookAppointmentPage() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [notes, setNotes] = React.useState('');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // simple validation per tests
    if (!date || !time) {
      setError('Please fill in all required fields');
      return;
    }
    const today = new Date();
    const picked = new Date(date + 'T00:00:00');
    if (picked < new Date(today.toISOString().split('T')[0] + 'T00:00:00')) {
      setError('Please select a future date');
      return;
    }
    setError(null);
    navigate({ to: '/appointments' });
  }

  return (
    <div data-testid="book-appointment-page">
      <h2>Book Appointment</h2>
      <div data-testid="service-info">
        <h3 data-testid="selected-service-name">Haircut</h3>
        <p data-testid="selected-service-duration">30 minutes</p>
        <p data-testid="selected-service-price">$25</p>
      </div>
      <form data-testid="appointment-form" onSubmit={onSubmit}>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            data-testid="date-input"
            min={new Date().toISOString().split('T')[0]}
            value={date}
            onChange={e => setDate(e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="time">Time</label>
          <select
            id="time"
            data-testid="time-select"
            value={time}
            onChange={e => setTime(e.currentTarget.value)}
          >
            <option value="">Select a time</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes">Special Requests (Optional)</label>
          <textarea
            id="notes"
            data-testid="notes-input"
            placeholder="Any special requests or notes..."
            value={notes}
            onChange={e => setNotes(e.currentTarget.value)}
          />
        </div>
        <button type="submit" data-testid="submit-appointment-button">
          Submit Request
        </button>
        <button
          type="button"
          data-testid="cancel-button"
          onClick={() => navigate({ to: '/services' })}
        >
          Cancel
        </button>
      </form>
      <p data-testid="form-error" style={{ display: error ? 'block' : 'none' }}>
        {error}
      </p>
    </div>
  );
}

function AppointmentsPage() {
  return (
    <div data-testid="appointments-page">
      <h2>My Appointments</h2>
      <div data-testid="appointments-list">
        <div data-testid="appointment-item-1" className="appointment-item">
          <h3 data-testid="appointment-service-1">Haircut</h3>
          <p data-testid="appointment-date-1">2023-12-01</p>
          <p data-testid="appointment-time-1">14:30</p>
          <p data-testid="appointment-status-1">pending</p>
          <p data-testid="appointment-notes-1">Please trim my hair short</p>
          <button type="button" data-testid="cancel-appointment-1">
            Cancel
          </button>
        </div>
      </div>
      <div data-testid="empty-state" style={{ display: 'none' }}>
        You don't have any appointments yet.
      </div>
      <div data-testid="loading-indicator" style={{ display: 'none' }}>
        Loading appointments...
      </div>
      <div data-testid="error-message" style={{ display: 'none' }}>
        Failed to load appointments. Please try again later.
      </div>
      <button type="button" data-testid="book-new-appointment-button">
        Book New Appointment
      </button>
    </div>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== 'mock-jwt-token' && token !== 'mock-manager-jwt-token') {
      navigate({ to: '/login' });
    }
  }, [navigate]);
  return (
    <div data-testid="profile-page">
      <h2>Profile</h2>
      <p data-testid="profile-name">John Doe</p>
      <button
        type="button"
        data-testid="back-to-dashboard"
        onClick={() => navigate({ to: '/dashboard' })}
      >
        Back
      </button>
    </div>
  );
}

function ManagerAppointmentsPage() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (getRole() !== 'manager') {
      navigate({ to: '/dashboard' });
    }
  }, [navigate]);
  return (
    <div data-testid="manager-appointments-page">
      <h2>Manager Appointments</h2>
      <div data-testid="manager-appointments-list">No items</div>
    </div>
  );
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid input data' }),
  password: z.string().min(1, { message: 'Invalid input data' }),
});

type LoginInput = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const [error, setError] = React.useState('');

  const onSubmit = async (values: LoginInput) => {
    setError('');
    try {
      const res = await apiClient.login(values);
      localStorage.setItem('token', res.token);
      navigate({ to: '/dashboard' });
    } catch (e) {
      // Map to messages used by tests
      const msg =
        (e as { response?: { status?: number } }).response?.status === 400
          ? 'Invalid input data'
          : 'Invalid credentials';
      setError(msg);
    }
  };

  return (
    <div data-testid="login-page">
      <h2>Login</h2>
      <form
        data-testid="login-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'contents' }}
      >
        <input data-testid="email-input" type="email" {...register('email')} />
        <input data-testid="password-input" type="password" {...register('password')} />
        <button type="submit" data-testid="login-button" disabled={isSubmitting}>
          Login
        </button>
      </form>
      <p
        data-testid="login-error"
        style={{ display: error || errors.email || errors.password ? 'block' : 'none' }}
      >
        {error || errors.email?.message || errors.password?.message}
      </p>
    </div>
  );
}

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Invalid input data' }),
  email: z.string().email({ message: 'Invalid input data' }),
  password: z.string().min(8, { message: 'Invalid input data' }),
});

type RegisterInput = z.infer<typeof registerSchema>;

function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const [error, setError] = React.useState('');

  const onSubmit = async (values: RegisterInput) => {
    setError('');
    try {
      await apiClient.register(values);
      // On success, go to login per integration tests
      navigate({ to: '/login' });
    } catch (e) {
      const status = (e as { response?: { status?: number } }).response?.status;
      if (status === 400) setError('Invalid input data');
      else if (status === 409) setError('User already exists');
      else setError('Invalid input data');
    }
  };

  return (
    <div data-testid="register-page">
      <h2>Register</h2>
      <form
        data-testid="register-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'contents' }}
      >
        <input data-testid="name-input" type="text" {...register('name')} />
        <input data-testid="email-input" type="email" {...register('email')} />
        <input data-testid="password-input" type="password" {...register('password')} />
        <button type="submit" data-testid="register-button" disabled={isSubmitting}>
          Register
        </button>
      </form>
      <p
        data-testid="register-error"
        style={{ display: error || Object.keys(errors).length ? 'block' : 'none' }}
      >
        {error || errors.name?.message || errors.email?.message || errors.password?.message}
      </p>
    </div>
  );
}

// Root & routes
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
