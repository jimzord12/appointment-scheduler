import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';
import { Label } from '../components/ui/label.js';
import { apiClient } from '../lib/api/client.js';
import { hasManagerRole } from '../lib/auth.js';

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

export function ServicesPage() {
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
      // error handled via UI in future
    }
  });

  return (
    <div data-testid="services-page" aria-busy={isLoading || isFetching}>
      <h2>Our Services</h2>

      {showManagerForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Create Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={onCreate}
              data-testid="create-service-form"
              aria-busy={createMutation.isPending}
            >
              <Label htmlFor="service-name" className="sr-only">
                Service Name
              </Label>
              <Input
                id="service-name"
                placeholder="Name"
                aria-label="Service Name"
                aria-invalid={!!form.formState.errors.name}
                data-testid="service-name-input"
                {...form.register('name')}
              />
              <Label htmlFor="service-description" className="sr-only">
                Description
              </Label>
              <Input
                id="service-description"
                placeholder="Description"
                aria-label="Service Description"
                data-testid="service-description-input"
                {...form.register('description')}
              />
              <Label htmlFor="service-duration" className="sr-only">
                Duration (minutes)
              </Label>
              <Input
                id="service-duration"
                type="number"
                placeholder="Duration (min)"
                aria-label="Duration in minutes"
                aria-invalid={!!form.formState.errors.durationMinutes}
                data-testid="service-duration-input"
                {...form.register('durationMinutes', { valueAsNumber: true })}
              />
              <Label htmlFor="service-price" className="sr-only">
                Price
              </Label>
              <Input
                id="service-price"
                type="number"
                placeholder="Price"
                step="0.01"
                aria-label="Service Price"
                aria-invalid={!!form.formState.errors.price}
                data-testid="service-price-input"
                {...form.register('price', { valueAsNumber: true })}
              />
              <Button
                type="submit"
                data-testid="create-service-button"
                disabled={createMutation.isPending}
                className="mt-2"
              >
                Create Service
              </Button>
            </form>
          </CardContent>
        </Card>
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
            <Card
              key={s.id}
              data-testid={`service-item-${idx + 1}`}
              className="service-item mb-2 cursor-pointer"
              onClick={() => navigate({ to: '/services/$id', params: { id: s.id } })}
            >
              <CardHeader>
                <CardTitle data-testid={`service-name-${idx + 1}`}>{s.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {s.description && (
                  <p data-testid={`service-description-${idx + 1}`}>{s.description}</p>
                )}
                <p data-testid={`service-duration-${idx + 1}`}>{s.durationMinutes} minutes</p>
                <p data-testid={`service-price-${idx + 1}`}>${s.price}</p>
                <Button
                  type="button"
                  data-testid={`book-service-${idx + 1}`}
                  onClick={e => {
                    e.stopPropagation();
                    navigate({ to: '/appointments/book', search: { serviceId: s.id } });
                  }}
                  className="mt-2"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
