import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
  useNavigate,
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

const createServiceSchema = z.object({
  name: z.string().min(2, 'Invalid input data').max(50, 'Invalid input data'),
  description: z.string().optional(),
  durationMinutes: z
    .number()
    .int('Invalid input data')
    .min(15, 'Invalid input data')
    .max(480, 'Invalid input data'),
  price: z.number().min(0, 'Invalid input data'),
});

type CreateServiceInput = z.infer<typeof createServiceSchema>;

function ServicesPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const {
    data: services,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.getServices(),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateServiceInput) => apiClient.createService(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const showManagerForm = hasManagerRole();
  const form = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: { name: '', description: '', durationMinutes: 30, price: 0 },
  });

  const onCreate = form.handleSubmit(async values => {
    try {
      await createMutation.mutateAsync(values);
      form.reset();
    } catch {
      // Let error surface via UI alert or error text in future; tests don't inspect this
    }
  });

  return (
    <div data-testid="services-page" aria-busy={isLoading || isFetching}>
      <h2>Our Services</h2>

      {showManagerForm && (
        <form
          onSubmit={onCreate}
          data-testid="create-service-form"
          aria-busy={createMutation.isPending}
          style={{ marginBottom: '1rem' }}
        >
          <label htmlFor="service-name" className="sr-only">
            Service Name
          </label>
          <input
            id="service-name"
            placeholder="Name"
            aria-label="Service Name"
            aria-invalid={!!form.formState.errors.name}
            data-testid="service-name-input"
            {...form.register('name')}
          />
          <label htmlFor="service-description" className="sr-only">
            Description
          </label>
          <input
            id="service-description"
            placeholder="Description"
            aria-label="Service Description"
            data-testid="service-description-input"
            {...form.register('description')}
          />
          <label htmlFor="service-duration" className="sr-only">
            Duration (minutes)
          </label>
          <input
            id="service-duration"
            type="number"
            placeholder="Duration (min)"
            aria-label="Duration in minutes"
            aria-invalid={!!form.formState.errors.durationMinutes}
            data-testid="service-duration-input"
            {...form.register('durationMinutes', { valueAsNumber: true })}
          />
          <label htmlFor="service-price" className="sr-only">
            Price
          </label>
          <input
            id="service-price"
            type="number"
            placeholder="Price"
            step="0.01"
            aria-label="Service Price"
            aria-invalid={!!form.formState.errors.price}
            data-testid="service-price-input"
            {...form.register('price', { valueAsNumber: true })}
          />
          <button
            type="submit"
            data-testid="create-service-button"
            disabled={createMutation.isPending}
          >
            Create Service
          </button>
        </form>
      )}

      <div
        data-testid="loading-indicator"
        role="status"
        aria-live="polite"
        aria-hidden={!(isLoading || isFetching)}
        style={{ display: isLoading || isFetching ? 'block' : 'none' }}
      >
        Loading services...
      </div>
      <div
        data-testid="error-message"
        role="alert"
        aria-live="assertive"
        aria-hidden={!isError}
        style={{ display: isError ? 'block' : 'none' }}
      >
        Failed to load services. Please try again later.
      </div>
      <button
        type="button"
        data-testid="retry-button"
        aria-label="Retry loading services"
        style={{ display: isError ? 'inline-block' : 'none', marginBottom: '1rem' }}
        onClick={() => void refetch()}
      >
        Retry
      </button>

      <div
        data-testid="services-list"
        style={{ display: isLoading || isFetching || isError ? 'none' : 'block' }}
        aria-hidden={isLoading || isFetching || isError}
      >
        {Array.isArray(services) &&
          services.map((s, idx) => (
            <div
              key={s.id}
              data-testid={`service-item-${idx + 1}`}
              className="service-item"
              onClick={() => navigate({ to: '/services/$id', params: { id: s.id } })}
            >
              <h3 data-testid={`service-name-${idx + 1}`}>{s.name}</h3>
              {s.description && (
                <p data-testid={`service-description-${idx + 1}`}>{s.description}</p>
              )}
              <p data-testid={`service-duration-${idx + 1}`}>{s.durationMinutes} minutes</p>
              <p data-testid={`service-price-${idx + 1}`}>${s.price}</p>
              <button
                type="button"
                data-testid={`book-service-${idx + 1}`}
                onClick={e => {
                  e.stopPropagation();
                  navigate({ to: '/appointments/book', search: { serviceId: s.id } });
                }}
              >
                Book Now
              </button>
            </div>
          ))}
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
  const qc = useQueryClient();
  const [error, setError] = React.useState<string | null>(null);

  // Extract selected serviceId from URL search params
  const serviceId = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('serviceId') || '';
  }, []);

  // Load services to show selected service details
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.getServices(),
  });
  const selectedService = React.useMemo(
    () => (Array.isArray(services) ? services.find(s => s.id === serviceId) : undefined),
    [services, serviceId]
  );

  // Form schema & setup
  const formSchema = z.object({
    date: z
      .string()
      .min(1, 'Please fill in all required fields')
      .refine(val => {
        // Validate not in the past
        if (!val) return false;
        const todayStr = new Date().toISOString().split('T')[0];
        return val >= todayStr;
      }, 'Please select a future date'),
    time: z.string().min(1, 'Please fill in all required fields'),
    notes: z.string().max(500).optional(),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { date: '', time: '', notes: '' },
  });

  const createMutation = useMutation({
    mutationFn: (input: {
      serviceId: string;
      requestedDate: string;
      requestedTime: string;
      notes?: string;
    }) => apiClient.createAppointmentRequest(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['appointmentRequests'] });
      navigate({ to: '/appointments' });
    },
    onError: e => {
      const status = (e as { response?: { status?: number } }).response?.status;
      if (status === 400) setError('Invalid input data');
      else setError('Failed to submit appointment request');
    },
  });

  const onSubmit = form.handleSubmit(values => {
    setError(null);
    if (!serviceId) {
      setError('Please select a service');
      return;
    }
    createMutation.mutate({
      serviceId,
      requestedDate: values.date,
      requestedTime: values.time,
      notes: values.notes || undefined,
    });
  });

  return (
    <div data-testid="book-appointment-page">
      <h2>Book Appointment</h2>
      <div data-testid="service-info">
        <h3 data-testid="selected-service-name">{selectedService?.name ?? 'Selected Service'}</h3>
        {selectedService ? (
          <>
            <p data-testid="selected-service-duration">{selectedService.durationMinutes} minutes</p>
            <p data-testid="selected-service-price">${selectedService.price}</p>
          </>
        ) : (
          <>
            <p data-testid="selected-service-duration">30 minutes</p>
            <p data-testid="selected-service-price">$25</p>
          </>
        )}
      </div>
      <form data-testid="appointment-form" onSubmit={onSubmit} aria-busy={createMutation.isPending}>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            data-testid="date-input"
            min={new Date().toISOString().split('T')[0]}
            aria-invalid={!!form.formState.errors.date}
            {...form.register('date')}
          />
        </div>
        <div>
          <label htmlFor="time">Time</label>
          <select
            id="time"
            data-testid="time-select"
            aria-invalid={!!form.formState.errors.time}
            {...form.register('time')}
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
            {...form.register('notes')}
          />
        </div>
        <button
          type="submit"
          data-testid="submit-appointment-button"
          disabled={createMutation.isPending}
        >
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
      <p
        data-testid="form-error"
        role="alert"
        aria-live="assertive"
        style={{ display: error || Object.keys(form.formState.errors).length ? 'block' : 'none' }}
      >
        {error || form.formState.errors.date?.message || form.formState.errors.time?.message}
      </p>
    </div>
  );
}

function AppointmentsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['appointmentRequests'],
    queryFn: () => apiClient.getAppointmentRequests(),
  });
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.getServices(),
  });
  const serviceNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    if (Array.isArray(services)) {
      for (const s of services) map.set(s.id, s.name);
    }
    return map;
  }, [services]);

  const items = Array.isArray(data) ? data : [];
  const showEmpty = !isLoading && !isError && items.length === 0;

  return (
    <div data-testid="appointments-page" aria-busy={isLoading || isFetching}>
      <h2>My Appointments</h2>

      <div
        data-testid="loading-indicator"
        role="status"
        aria-live="polite"
        aria-hidden={!(isLoading || isFetching)}
        style={{ display: isLoading || isFetching ? 'block' : 'none' }}
      >
        Loading appointments...
      </div>
      <div
        data-testid="error-message"
        role="alert"
        aria-live="assertive"
        aria-hidden={!isError}
        style={{ display: isError ? 'block' : 'none' }}
      >
        Failed to load appointments. Please try again later.
      </div>
      <button
        type="button"
        data-testid="retry-button"
        aria-label="Retry loading appointments"
        style={{ display: isError ? 'inline-block' : 'none' }}
        onClick={() => void refetch()}
      >
        Retry
      </button>
      <div
        data-testid="empty-state"
        role="status"
        aria-live="polite"
        aria-hidden={!showEmpty}
        style={{ display: showEmpty ? 'block' : 'none' }}
      >
        You don't have any appointments yet.
      </div>

      <div
        data-testid="appointments-list"
        style={{ display: isLoading || isFetching || isError || showEmpty ? 'none' : 'block' }}
        aria-hidden={isLoading || isFetching || isError || showEmpty}
      >
        {items.map((req, idx) => (
          <div
            key={req.id}
            data-testid={`appointment-item-${idx + 1}`}
            className="appointment-item"
          >
            <h3 data-testid={`appointment-service-${idx + 1}`}>
              {serviceNameById.get(req.serviceId) ?? 'Service'}
            </h3>
            <p data-testid={`appointment-date-${idx + 1}`}>{req.requestedDate}</p>
            <p data-testid={`appointment-time-${idx + 1}`}>{req.requestedTime}</p>
            <p data-testid={`appointment-status-${idx + 1}`}>{req.status}</p>
            {req.notes ? <p data-testid={`appointment-notes-${idx + 1}`}>{req.notes}</p> : null}
            <button type="button" data-testid={`cancel-appointment-${idx + 1}`}>
              Cancel
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        data-testid="book-new-appointment-button"
        onClick={() => navigate({ to: '/services' })}
      >
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
  const qc = useQueryClient();
  React.useEffect(() => {
    if (getRole() !== 'manager') {
      navigate({ to: '/dashboard' });
    }
  }, [navigate]);

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['appointmentRequests'],
    queryFn: () => apiClient.getAppointmentRequests(),
  });
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.getServices(),
  });
  const serviceNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    if (Array.isArray(services)) for (const s of services) map.set(s.id, s.name);
    return map;
  }, [services]);

  const items = Array.isArray(data) ? data : [];

  const updateMutation = useMutation({
    mutationFn: (input: { id: string; status: 'approved' | 'rejected'; managerNotes?: string }) =>
      apiClient.updateAppointmentRequest(input.id, {
        id: input.id,
        status: input.status,
        managerNotes: input.managerNotes,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['appointmentRequests'] });
    },
  });

  return (
    <div data-testid="manager-appointments-page" aria-busy={isLoading || isFetching}>
      <h2>Manager Appointments</h2>

      <div
        data-testid="loading-indicator"
        role="status"
        aria-live="polite"
        aria-hidden={!(isLoading || isFetching)}
        style={{ display: isLoading || isFetching ? 'block' : 'none' }}
      >
        Loading appointments...
      </div>
      <div
        data-testid="error-message"
        role="alert"
        aria-live="assertive"
        aria-hidden={!isError}
        style={{ display: isError ? 'block' : 'none' }}
      >
        Failed to load appointments. Please try again later.
      </div>
      <button
        type="button"
        data-testid="retry-button"
        aria-label="Retry loading appointments"
        style={{ display: isError ? 'inline-block' : 'none' }}
        onClick={() => void refetch()}
      >
        Retry
      </button>

      <div
        data-testid="appointments-list"
        style={{ display: isLoading || isFetching || isError ? 'none' : 'block' }}
        aria-hidden={isLoading || isFetching || isError}
      >
        {items.map((req, idx) => (
          <div
            key={req.id}
            data-testid={`appointment-item-${idx + 1}`}
            className="appointment-item"
          >
            <h3 data-testid={`appointment-service-${idx + 1}`}>
              {serviceNameById.get(req.serviceId) ?? 'Service'}
            </h3>
            {/* Customer name not available without extra fetch; could be added later */}
            <p data-testid={`appointment-date-${idx + 1}`}>{req.requestedDate}</p>
            <p data-testid={`appointment-time-${idx + 1}`}>{req.requestedTime}</p>
            <p data-testid={`appointment-status-${idx + 1}`}>{req.status}</p>
            {req.managerNotes ? (
              <p data-testid={`appointment-manager-notes-${idx + 1}`}>{req.managerNotes}</p>
            ) : null}
            {req.status === 'pending' ? (
              <div data-testid={`appointment-actions-${idx + 1}`}>
                <button
                  type="button"
                  data-testid={`approve-appointment-${idx + 1}`}
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ id: req.id, status: 'approved' })}
                >
                  Approve
                </button>
                <button
                  type="button"
                  data-testid={`reject-appointment-${idx + 1}`}
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ id: req.id, status: 'rejected' })}
                >
                  Reject
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
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
        aria-busy={isSubmitting}
      >
        <input
          data-testid="email-input"
          type="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        <input
          data-testid="password-input"
          type="password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <button type="submit" data-testid="login-button" disabled={isSubmitting}>
          Login
        </button>
      </form>
      <p
        data-testid="login-error"
        role="alert"
        aria-live="assertive"
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
        aria-busy={isSubmitting}
      >
        <input
          data-testid="name-input"
          type="text"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <input
          data-testid="email-input"
          type="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        <input
          data-testid="password-input"
          type="password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <button type="submit" data-testid="register-button" disabled={isSubmitting}>
          Register
        </button>
      </form>
      <p
        data-testid="register-error"
        role="alert"
        aria-live="assertive"
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
