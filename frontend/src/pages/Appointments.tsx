import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { apiClient } from '../lib/api/client.js';

export function AppointmentsPage() {
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
