import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock components that don't exist yet
const ProfilePage = () => (
  <div data-testid="profile-page">
    <h2>My Profile</h2>
    <div data-testid="profile-info">
      <p data-testid="profile-name">John Doe</p>
      <p data-testid="profile-email">john@example.com</p>
      <p data-testid="profile-role">Customer</p>
    </div>
    <div data-testid="profile-edit-form" style={{ display: 'none' }}>
      <input type="text" placeholder="Name" data-testid="name-input" />
      <input type="email" placeholder="Email" data-testid="email-input" />
      <button type="button" data-testid="save-button">
        Save Changes
      </button>
      <button type="button" data-testid="cancel-button">
        Cancel
      </button>
      <p data-testid="profile-error" style={{ display: 'none' }}></p>
    </div>
    <button type="button" data-testid="edit-profile-button">
      Edit Profile
    </button>
  </div>
);

const Dashboard = () => (
  <div data-testid="dashboard">
    <h2>Dashboard</h2>
    <p data-testid="welcome-message">Welcome, John Doe!</p>
    <button type="button" data-testid="profile-link">
      My Profile
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

describe('User Profile Management Flow Integration Tests', () => {
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

  describe('Viewing Profile', () => {
    it('should display user profile information when logged in', async () => {
      // Arrange
      render(<ProfilePage />);

      // Assert
      expect(screen.getByTestId('profile-page')).toBeVisible();
      expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('profile-email')).toHaveTextContent('john@example.com');
      expect(screen.getByTestId('profile-role')).toHaveTextContent('Customer');
    });

    it('should navigate to profile page from dashboard', async () => {
      // Arrange
      render(<Dashboard />);

      // Act
      await user.click(screen.getByTestId('profile-link'));

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('should show edit button on profile page', async () => {
      // Arrange
      render(<ProfilePage />);

      // Assert
      expect(screen.getByTestId('edit-profile-button')).toBeVisible();
    });
  });

  describe('Editing Profile', () => {
    it('should show edit form when edit button is clicked', async () => {
      // Arrange
      render(<ProfilePage />);

      // Act
      await user.click(screen.getByTestId('edit-profile-button'));

      // Assert
      expect(screen.getByTestId('profile-edit-form')).toBeVisible();
      expect(screen.getByTestId('name-input')).toHaveValue('John Doe');
      expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
    });

    it('should successfully update profile information', async () => {
      // Arrange
      render(<ProfilePage />);

      // Act - Click edit button
      await user.click(screen.getByTestId('edit-profile-button'));

      // Act - Update name
      await user.clear(screen.getByTestId('name-input'));
      await user.type(screen.getByTestId('name-input'), 'Jane Smith');

      // Act - Save changes
      await user.click(screen.getByTestId('save-button'));

      // Assert
      await waitFor(() => {
        // Check if form is hidden
        expect(screen.getByTestId('profile-edit-form')).not.toBeVisible();
        // Check if updated name is displayed
        expect(screen.getByTestId('profile-name')).toHaveTextContent('Jane Smith');
        // Check if error message is not shown
        expect(screen.queryByTestId('profile-error')).not.toBeVisible();
      });
    });

    it('should show validation error for invalid profile data', async () => {
      // Arrange
      render(<ProfilePage />);

      // Act - Click edit button
      await user.click(screen.getByTestId('edit-profile-button'));

      // Act - Enter invalid data
      await user.clear(screen.getByTestId('name-input'));
      await user.type(screen.getByTestId('name-input'), 'J'); // Name too short
      await user.clear(screen.getByTestId('email-input'));
      await user.type(screen.getByTestId('email-input'), 'invalid-email'); // Invalid email

      // Act - Try to save
      await user.click(screen.getByTestId('save-button'));

      // Assert
      await waitFor(() => {
        // Check if error message is displayed
        const errorElement = screen.getByTestId('profile-error');
        expect(errorElement).toBeVisible();
        expect(errorElement).toHaveTextContent('Invalid input data');
        // Check if form is still visible
        expect(screen.getByTestId('profile-edit-form')).toBeVisible();
      });
    });

    it('should cancel editing when cancel button is clicked', async () => {
      // Arrange
      render(<ProfilePage />);

      // Act - Click edit button
      await user.click(screen.getByTestId('edit-profile-button'));

      // Act - Make changes
      await user.clear(screen.getByTestId('name-input'));
      await user.type(screen.getByTestId('name-input'), 'Jane Smith');

      // Act - Cancel editing
      await user.click(screen.getByTestId('cancel-button'));

      // Assert
      await waitFor(() => {
        // Check if form is hidden
        expect(screen.getByTestId('profile-edit-form')).not.toBeVisible();
        // Check if original name is still displayed
        expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');
      });
    });
  });

  describe('Profile Access Control', () => {
    it('should prevent access to profile when not logged in', async () => {
      // Arrange - No token in localStorage
      localStorage.removeItem('token');

      // Act - Try to access profile
      render(<ProfilePage />);

      // Assert - Should be redirected to login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle expired token scenario', async () => {
      // Arrange - Set expired token
      localStorage.setItem('token', 'expired-token');

      // Act - Try to access profile
      render(<ProfilePage />);

      // Assert - Should be redirected to login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Profile Data Persistence', () => {
    it('should persist profile changes after page refresh', async () => {
      // Arrange
      render(<ProfilePage />);

      // Act - Click edit button
      await user.click(screen.getByTestId('edit-profile-button'));

      // Act - Update name
      await user.clear(screen.getByTestId('name-input'));
      await user.type(screen.getByTestId('name-input'), 'Jane Smith');

      // Act - Save changes
      await user.click(screen.getByTestId('save-button'));

      // Assert - Changes are saved
      await waitFor(() => {
        expect(screen.getByTestId('profile-name')).toHaveTextContent('Jane Smith');
      });

      // Act - Simulate page refresh by re-rendering
      render(<ProfilePage />);

      // Assert - Changes persist
      expect(screen.getByTestId('profile-name')).toHaveTextContent('Jane Smith');
    });

    it('should reflect profile changes in dashboard welcome message', async () => {
      // Arrange - Start with profile page
      render(<ProfilePage />);

      // Act - Click edit button
      await user.click(screen.getByTestId('edit-profile-button'));

      // Act - Update name
      await user.clear(screen.getByTestId('name-input'));
      await user.type(screen.getByTestId('name-input'), 'Jane Smith');

      // Act - Save changes
      await user.click(screen.getByTestId('save-button'));

      // Assert - Changes are saved in profile
      await waitFor(() => {
        expect(screen.getByTestId('profile-name')).toHaveTextContent('Jane Smith');
      });

      // Act - Navigate to dashboard
      await user.click(screen.getByTestId('dashboard-link')); // Assuming this link exists

      // Assert - Dashboard shows updated name
      await waitFor(() => {
        expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome, Jane Smith!');
      });
    });
  });
});
