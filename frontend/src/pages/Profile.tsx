import { useNavigate } from '@tanstack/react-router';
import React from 'react';

export function ProfilePage() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== 'mock-jwt-token' && token !== 'mock-manager-jwt-token') {
      navigate({ to: '/login' });
    }
  }, [navigate]);
  return (
    <div data-testid="profile-page">
      <h2>Profile</h2>
      <p data-testid="profile-name">John Doe</p>
      <button
        type="button"
        data-testid="back-to-dashboard"
        onClick={() => navigate({ to: '/dashboard' })}
      >
        Back
      </button>
    </div>
  );
}
