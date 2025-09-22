import { Outlet } from '@tanstack/react-router';

import { LanguageSwitcher } from '../LanguageSwitcher.js';
import { ThemeToggle } from '../ThemeToggle.js';

export function AppLayout() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <header
        style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <h1>Appointment Scheduler</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
