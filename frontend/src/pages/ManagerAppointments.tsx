import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { Button } from '../components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { apiClient } from '../lib/api/client.js';
import { getRole } from '../lib/auth.js';

export function ManagerAppointmentsPage() {
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
          <Card
            key={req.id}
            data-testid={`appointment-item-${idx + 1}`}
            className="appointment-item mb-2"
          >
            <CardHeader>
              <CardTitle data-testid={`appointment-service-${idx + 1}`}>
                {serviceNameById.get(req.serviceId) ?? 'Service'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p data-testid={`appointment-date-${idx + 1}`}>{req.requestedDate}</p>
              <p data-testid={`appointment-time-${idx + 1}`}>{req.requestedTime}</p>
              <p data-testid={`appointment-status-${idx + 1}`}>{req.status}</p>
              {req.managerNotes ? (
                <p data-testid={`appointment-manager-notes-${idx + 1}`}>{req.managerNotes}</p>
              ) : null}
              {req.status === 'pending' ? (
                <div data-testid={`appointment-actions-${idx + 1}`} className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    data-testid={`approve-appointment-${idx + 1}`}
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: req.id, status: 'approved' })}
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    data-testid={`reject-appointment-${idx + 1}`}
                    disabled={updateMutation.isPending}
                    variant="outline"
                    onClick={() => updateMutation.mutate({ id: req.id, status: 'rejected' })}
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
