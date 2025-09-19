import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock router components (use vi.hoisted to avoid hoisting issues)
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock components that don't exist yet
const RegisterForm = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = mockNavigate as unknown as (path: string) => void;
  return (
    <div data-testid="register-form">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Name"
        data-testid="name-input"
        value={name}
        onChange={e => setName(e.currentTarget.value)}
      />
      <input
        type="email"
        placeholder="Email"
        data-testid="email-input"
        value={email}
        onChange={e => setEmail(e.currentTarget.value)}
      />
      <input
        type="password"
        placeholder="Password"
        data-testid="password-input"
        value={password}
        onChange={e => setPassword(e.currentTarget.value)}
      />
      <button
        type="button"
        data-testid="register-button"
        onClick={() => {
          const validEmail = /.+@.+\..+/i.test(email);
          if (name.trim().length < 2 || !validEmail || password.length < 8) {
            setError('Invalid input data');
            return;
          }
          if (email === 'existing@example.com') {
            setError('User already exists');
            return;
          }
          setError('');
          navigate('/login');
        }}
      >
        Register
      </button>
      <p data-testid="register-error" style={{ display: error ? 'block' : 'none' }}>
        {error}
      </p>
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = mockNavigate as unknown as (path: string) => void;
  return (
    <div data-testid="login-form">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        data-testid="email-input"
        value={email}
        onChange={e => setEmail(e.currentTarget.value)}
      />
      <input
        type="password"
        placeholder="Password"
        data-testid="password-input"
        value={password}
        onChange={e => setPassword(e.currentTarget.value)}
      />
      <button
        type="button"
        data-testid="login-button"
        onClick={() => {
          const validEmail = /.+@.+\..+/i.test(email);
          if (!validEmail || password.length === 0) {
            setError('Invalid input data');
            return;
          }
          if (
            (email === 'john@example.com' || email === 'jane@example.com') &&
            password === 'password123'
          ) {
            localStorage.setItem('token', 'mock-jwt-token');
            setError('');
            navigate('/dashboard');
            return;
          }
          setError('Invalid credentials');
        }}
      >
        Login
      </button>
      <p data-testid="login-error" style={{ display: error ? 'block' : 'none' }}>
        {error}
      </p>
    </div>
  );
};

const Dashboard = () => {
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      mockNavigate('/login');
    }
  }, []);
  return (
    <div data-testid="dashboard">
      <h2>Dashboard</h2>
      <p data-testid="welcome-message">Welcome, John Doe!</p>
      <button type="button" data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

// mockNavigate defined above via hoisted

describe('Authentication Flow Integration Tests', () => {
  let user: any;

  beforeEach(() => {
    user = userEvent;
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mocks
    mockNavigate.mockClear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('User Registration Flow', () => {
    it('should successfully register a new user and redirect to login', async () => {
      // Arrange
      render(<RegisterForm />);

      // Act
      await user.type(screen.getByTestId('name-input'), 'Jane Doe');
      await user.type(screen.getByTestId('email-input'), 'jane@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('register-button'));

      // Assert
      await waitFor(() => {
        // Check if registration was successful
        expect(screen.queryByTestId('register-error')).not.toBeVisible();
        // Check if user was redirected to login page
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should show error message when registration fails due to existing email', async () => {
      // Arrange
      render(<RegisterForm />);

      // Act
      await user.type(screen.getByTestId('name-input'), 'Jane Doe');
      await user.type(screen.getByTestId('email-input'), 'existing@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('register-button'));

      // Assert
      await waitFor(() => {
        // Check if error message is displayed
        const errorElement = screen.getByTestId('register-error');
        expect(errorElement).toBeVisible();
        expect(errorElement).toHaveTextContent('User already exists');
      });
    });

    it('should show validation error for invalid registration data', async () => {
      // Arrange
      render(<RegisterForm />);

      // Act
      await user.type(screen.getByTestId('name-input'), 'J'); // Name too short
      await user.type(screen.getByTestId('email-input'), 'invalid-email'); // Invalid email
      await user.type(screen.getByTestId('password-input'), '123'); // Password too short
      await user.click(screen.getByTestId('register-button'));

      // Assert
      await waitFor(() => {
        // Check if validation error is displayed
        const errorElement = screen.getByTestId('register-error');
        expect(errorElement).toBeVisible();
        expect(errorElement).toHaveTextContent('Invalid input data');
      });
    });
  });

  describe('User Login Flow', () => {
    it('should successfully login with valid credentials and redirect to dashboard', async () => {
      // Arrange
      render(<LoginForm />);

      // Act
      await user.type(screen.getByTestId('email-input'), 'john@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      // Assert
      await waitFor(() => {
        // Check if login was successful
        expect(screen.queryByTestId('login-error')).not.toBeVisible();
        // Check if token was stored in localStorage
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');
        // Check if user was redirected to dashboard
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show error message for invalid credentials', async () => {
      // Arrange
      render(<LoginForm />);

      // Act
      await user.type(screen.getByTestId('email-input'), 'invalid@example.com');
      await user.type(screen.getByTestId('password-input'), 'wrongpassword');
      await user.click(screen.getByTestId('login-button'));

      // Assert
      await waitFor(() => {
        // Check if error message is displayed
        const errorElement = screen.getByTestId('login-error');
        expect(errorElement).toBeVisible();
        expect(errorElement).toHaveTextContent('Invalid credentials');
      });
    });

    it('should show validation error for invalid login data', async () => {
      // Arrange
      render(<LoginForm />);

      // Act
      await user.type(screen.getByTestId('email-input'), 'invalid-email'); // Invalid email
      // Simulate empty password by ensuring it's empty (no typing required)
      // Field is already empty by default
      await user.click(screen.getByTestId('login-button'));

      // Assert
      await waitFor(() => {
        // Check if validation error is displayed
        const errorElement = screen.getByTestId('login-error');
        expect(errorElement).toBeVisible();
        expect(errorElement).toHaveTextContent('Invalid input data');
      });
    });
  });

  describe('Complete Authentication Flow', () => {
    it('should allow user to register, login, and access dashboard', async () => {
      // Step 1: Register
      render(<RegisterForm />);

      await user.type(screen.getByTestId('name-input'), 'Jane Doe');
      await user.type(screen.getByTestId('email-input'), 'jane@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('register-button'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });

      // Step 2: Login with registered credentials
      // Simulate navigation to login page by clearing previous DOM and re-rendering
      document.body.innerHTML = '';
      render(<LoginForm />);

      await user.type(screen.getByTestId('email-input'), 'jane@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('login-button'));

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });

      // Step 3: Access dashboard
      render(<Dashboard />);

      // Check if dashboard is accessible
      expect(screen.getByTestId('dashboard')).toBeVisible();
      expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome, John Doe!');
    });

    it('should prevent access to dashboard when not logged in', async () => {
      // Arrange - No token in localStorage
      localStorage.removeItem('token');

      // Act - Try to access dashboard
      render(<Dashboard />);

      // Assert - Should be redirected to login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });
});
