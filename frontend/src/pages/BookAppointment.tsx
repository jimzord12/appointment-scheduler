import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';
import { Label } from '../components/ui/label.js';
import { Select } from '../components/ui/select.js';
import { Textarea } from '../components/ui/textarea.js';
import { apiClient } from '../lib/api/client.js';

export function BookAppointmentPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [error, setError] = React.useState<string | null>(null);

  const serviceId = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('serviceId') || '';
  }, []);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.getServices(),
  });
  const selectedService = React.useMemo(
    () => (Array.isArray(services) ? services.find(s => s.id === serviceId) : undefined),
    [services, serviceId]
  );

  const formSchema = z.object({
    date: z
      .string()
      .min(1, 'Please fill in all required fields')
      .refine(val => {
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
      <Card>
        <CardHeader>
          <CardTitle>Selected Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-testid="service-info">
            <h3 data-testid="selected-service-name">
              {selectedService?.name ?? 'Selected Service'}
            </h3>
            {selectedService ? (
              <>
                <p data-testid="selected-service-duration">
                  {selectedService.durationMinutes} minutes
                </p>
                <p data-testid="selected-service-price">${selectedService.price}</p>
              </>
            ) : (
              <>
                <p data-testid="selected-service-duration">30 minutes</p>
                <p data-testid="selected-service-price">$25</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <form data-testid="appointment-form" onSubmit={onSubmit} aria-busy={createMutation.isPending}>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            data-testid="date-input"
            min={new Date().toISOString().split('T')[0]}
            aria-invalid={!!form.formState.errors.date}
            {...form.register('date')}
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Select
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
          </Select>
        </div>
        <div>
          <Label htmlFor="notes">Special Requests (Optional)</Label>
          <Textarea
            id="notes"
            data-testid="notes-input"
            placeholder="Any special requests or notes..."
            {...form.register('notes')}
          />
        </div>
        <div className="mt-2 flex gap-2">
          <Button
            type="submit"
            data-testid="submit-appointment-button"
            disabled={createMutation.isPending}
          >
            Submit Request
          </Button>
          <Button
            type="button"
            data-testid="cancel-button"
            variant="outline"
            onClick={() => navigate({ to: '/services' })}
          >
            Cancel
          </Button>
        </div>
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
