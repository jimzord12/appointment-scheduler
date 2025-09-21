import { useNavigate } from '@tanstack/react-router';

export function DashboardPage() {
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
