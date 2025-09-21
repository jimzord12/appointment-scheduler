import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { RegisterPage } from '../pages/Register.js';

// T054: Frontend form validation unit tests — Register form

describe('Register form validation', () => {
  it('shows error on short name, invalid email, and short password', async () => {
    render(<RegisterPage />);

    await userEvent.type(screen.getByTestId('name-input'), 'A');
    await userEvent.type(screen.getByTestId('email-input'), 'bad');
    await userEvent.type(screen.getByTestId('password-input'), '123');

    await userEvent.click(screen.getByTestId('register-button'));

    const alert = await screen.findByTestId('register-error');
    expect(alert).toHaveTextContent('Invalid input data');
  });

  it('submits when inputs are valid (error area stays empty)', async () => {
    render(<RegisterPage />);

    await userEvent.clear(screen.getByTestId('name-input'));
    await userEvent.type(screen.getByTestId('name-input'), 'Alice');
    await userEvent.clear(screen.getByTestId('email-input'));
    await userEvent.type(screen.getByTestId('email-input'), 'alice@example.com');
    await userEvent.clear(screen.getByTestId('password-input'));
    await userEvent.type(screen.getByTestId('password-input'), 'password123');

    await userEvent.click(screen.getByTestId('register-button'));

    const alert = await screen.findByTestId('register-error');
    expect(alert.textContent?.trim()).toBe('');
  });
});
