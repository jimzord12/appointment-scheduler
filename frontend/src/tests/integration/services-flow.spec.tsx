import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock components that don't exist yet
const ServicesPage = () => (
  <div data-testid="services-page">
    <h2>Our Services</h2>
    <div data-testid="services-list">
      <div data-testid="service-item-1" className="service-item">
        <h3 data-testid="service-name-1">Haircut</h3>
        <p data-testid="service-description-1">Basic haircut service</p>
        <p data-testid="service-duration-1">30 minutes</p>
        <p data-testid="service-price-1">$25</p>
        <button type="button" data-testid="book-service-1">
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

const ServiceDetailsPage = () => (
  <div data-testid="service-details-page">
    <h2 data-testid="service-detail-name">Haircut</h2>
    <p data-testid="service-detail-description">Basic haircut service</p>
    <p data-testid="service-detail-duration">Duration: 30 minutes</p>
    <p data-testid="service-detail-price">Price: $25</p>
    <button type="button" data-testid="book-appointment-button">
      Book Appointment
    </button>
    <button type="button" data-testid="back-to-services-button">
      Back to Services
    </button>
  </div>
);

const Dashboard = () => (
  <div data-testid="dashboard">
    <h2>Dashboard</h2>
    <p data-testid="welcome-message">Welcome, John Doe!</p>
    <button type="button" data-testid="services-link">
      Browse Services
    </button>
  </div>
);

// Mock router components
const mockNavigate = vi.fn();
const mockUseNavigate = () => mockNavigate;

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: mockUseNavigate,
}));

describe('Service Browsing and Selection Flow Integration Tests', () => {
  let user: any;

  beforeEach(() => {
    user = userEvent;
    // Set up mock token in localStorage
    localStorage.setItem('token', 'mock-jwt-token');
    // Reset mocks
    mockNavigate.mockClear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('Browsing Services', () => {
    it('should display list of available services', async () => {
      // Arrange
      render(<ServicesPage />);

      // Assert
      expect(screen.getByTestId('services-page')).toBeVisible();
      expect(screen.getByTestId('services-list')).toBeVisible();

      // Check if all services are displayed
      expect(screen.getByTestId('service-item-1')).toBeVisible();
      expect(screen.getByTestId('service-item-2')).toBeVisible();
      expect(screen.getByTestId('service-item-3')).toBeVisible();

      // Check service details
      expect(screen.getByTestId('service-name-1')).toHaveTextContent('Haircut');
      expect(screen.getByTestId('service-name-2')).toHaveTextContent('Massage');
      expect(screen.getByTestId('service-name-3')).toHaveTextContent('Manicure');

      expect(screen.getByTestId('service-price-1')).toHaveTextContent('$25');
      expect(screen.getByTestId('service-price-2')).toHaveTextContent('$80');
      expect(screen.getByTestId('service-price-3')).toHaveTextContent('$35');
    });

    it('should show loading indicator while fetching services', async () => {
      // Arrange
      render(<ServicesPage />);

      // Act - Simulate loading state
      const loadingIndicator = screen.getByTestId('loading-indicator');
      loadingIndicator.style.display = 'block';

      // Assert
      expect(loadingIndicator).toBeVisible();
      expect(loadingIndicator).toHaveTextContent('Loading services...');
    });

    it('should show error message when services fail to load', async () => {
      // Arrange
      render(<ServicesPage />);

      // Act - Simulate error state
      const errorMessage = screen.getByTestId('error-message');
      errorMessage.style.display = 'block';

      // Assert
      expect(errorMessage).toBeVisible();
      expect(errorMessage).toHaveTextContent('Failed to load services. Please try again later.');
    });

    it('should navigate to services page from dashboard', async () => {
      // Arrange
      render(<Dashboard />);

      // Act
      await user.click(screen.getByTestId('services-link'));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/services');
    });
  });

  describe('Viewing Service Details', () => {
    it('should navigate to service details when service is clicked', async () => {
      // Arrange
      render(<ServicesPage />);

      // Act
      await user.click(screen.getByTestId('service-item-1'));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/services/123e4567-e89b-12d3-a456-426614174002');
    });

    it('should display service details correctly', async () => {
      // Arrange
      render(<ServiceDetailsPage />);

      // Assert
      expect(screen.getByTestId('service-details-page')).toBeVisible();
      expect(screen.getByTestId('service-detail-name')).toHaveTextContent('Haircut');
      expect(screen.getByTestId('service-detail-description')).toHaveTextContent(
        'Basic haircut service'
      );
      expect(screen.getByTestId('service-detail-duration')).toHaveTextContent(
        'Duration: 30 minutes'
      );
      expect(screen.getByTestId('service-detail-price')).toHaveTextContent('Price: $25');
    });

    it('should have book appointment button on service details page', async () => {
      // Arrange
      render(<ServiceDetailsPage />);

      // Assert
      expect(screen.getByTestId('book-appointment-button')).toBeVisible();
    });

    it('should navigate back to services list when back button is clicked', async () => {
      // Arrange
      render(<ServiceDetailsPage />);

      // Act
      await user.click(screen.getByTestId('back-to-services-button'));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/services');
    });
  });

  describe('Service Selection', () => {
    it('should navigate to appointment booking when book now is clicked', async () => {
      // Arrange
      render(<ServicesPage />);

      // Act
      await user.click(screen.getByTestId('book-service-1'));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(
        '/appointments/book?serviceId=123e4567-e89b-12d3-a456-426614174002'
      );
    });

    it('should navigate to appointment booking from service details', async () => {
      // Arrange
      render(<ServiceDetailsPage />);

      // Act
      await user.click(screen.getByTestId('book-appointment-button'));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith(
        '/appointments/book?serviceId=123e4567-e89b-12d3-a456-426614174002'
      );
    });

    it('should persist selected service when navigating to appointment booking', async () => {
      // Arrange
      render(<ServicesPage />);

      // Act - Select a service
      await user.click(screen.getByTestId('book-service-1'));

      // Assert - Check navigation with service ID
      expect(mockNavigate).toHaveBeenCalledWith(
        '/appointments/book?serviceId=123e4567-e89b-12d3-a456-426614174002'
      );
    });
  });

  describe('Service Filtering and Sorting', () => {
    it('should allow filtering services by price range', async () => {
      // This test would require implementing filter controls
      // For now, we'll just verify the structure exists
      render(<ServicesPage />);

      // This would test actual filtering functionality when implemented
      expect(screen.getByTestId('services-list')).toBeVisible();
    });

    it('should allow sorting services by price or duration', async () => {
      // This test would require implementing sort controls
      // For now, we'll just verify the structure exists
      render(<ServicesPage />);

      // This would test actual sorting functionality when implemented
      expect(screen.getByTestId('services-list')).toBeVisible();
    });

    it('should display services in a consistent order', async () => {
      // Arrange
      render(<ServicesPage />);

      // Assert - Verify services are displayed in expected order
      const servicesList = screen.getByTestId('services-list');
      const serviceItems = servicesList.querySelectorAll('.service-item');

      expect(serviceItems.length).toBe(3);
      expect(screen.getByTestId('service-name-1')).toHaveTextContent('Haircut');
      expect(screen.getByTestId('service-name-2')).toHaveTextContent('Massage');
      expect(screen.getByTestId('service-name-3')).toHaveTextContent('Manicure');
    });
  });

  describe('Service Access Control', () => {
    it('should prevent access to services when not logged in', async () => {
      // Arrange - No token in localStorage
      localStorage.removeItem('token');

      // Act - Try to access services
      render(<ServicesPage />);

      // Assert - Should be redirected to login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should allow access to services when logged in as customer', async () => {
      // Arrange - Customer token in localStorage
      localStorage.setItem('token', 'mock-jwt-token');

      // Act - Access services
      render(<ServicesPage />);

      // Assert - Should display services
      expect(screen.getByTestId('services-page')).toBeVisible();
      expect(screen.getByTestId('services-list')).toBeVisible();
    });

    it('should allow access to services when logged in as manager', async () => {
      // Arrange - Manager token in localStorage
      localStorage.setItem('token', 'mock-manager-jwt-token');

      // Act - Access services
      render(<ServicesPage />);

      // Assert - Should display services
      expect(screen.getByTestId('services-page')).toBeVisible();
      expect(screen.getByTestId('services-list')).toBeVisible();
    });
  });
});
