import { useNavigate } from '@tanstack/react-router';
import React from 'react';

export function Home() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate({ to: '/dashboard' });
  }, [navigate]);
  return null;
}
