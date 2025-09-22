import { Outlet } from '@tanstack/react-router';

import { t } from '../../lib/i18n/index.js';
import { LanguageSwitcher } from '../LanguageSwitcher.js';
import { SettingsPanel } from '../SettingsPanel.js';
import { ThemeToggle } from '../ThemeToggle.js';

export function AppLayout() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <header
        style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <h1>{t('app.title')}</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <LanguageSwitcher />
          <ThemeToggle />
          <SettingsPanel />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
