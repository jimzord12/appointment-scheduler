import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LoginPage } from '../pages/Login.js';

// T054: Frontend form validation unit tests
// Focus: Login form shows validation messages for invalid inputs.

describe('Login form validation', () => {
  it('shows error on invalid email and empty password', async () => {
    render(<LoginPage />);

    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const submit = screen.getByTestId('login-button');

    await userEvent.clear(email);
    await userEvent.type(email, 'not-an-email');

    await userEvent.clear(password);

    await userEvent.click(submit);

    const alert = await screen.findByTestId('login-error');
    expect(alert).toHaveTextContent('Invalid input data');
  });

  it('submits when inputs are valid (error area stays empty)', async () => {
    render(<LoginPage />);

    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const submit = screen.getByTestId('login-button');

    await userEvent.clear(email);
    await userEvent.type(email, 'valid@example.com');

    await userEvent.clear(password);
    await userEvent.type(password, 'password123');

    await userEvent.click(submit);

    const alert = await screen.findByTestId('login-error');
    // On success, the component clears the error; the paragraph still exists but should be empty
    expect(alert.textContent?.trim()).toBe('');
  });
});
