import { useNavigate } from '@tanstack/react-router';

export function ServiceDetailsPage() {
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
