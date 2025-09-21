import { Outlet } from '@tanstack/react-router';

export function AppLayout() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Appointment Scheduler</h1>
      <Outlet />
    </div>
  );
}
