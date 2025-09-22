import { useEffect, useState } from 'react';

import { applyTheme, getThemeMode, setThemeMode, type ThemeMode } from '../lib/theme/index.js';

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getThemeMode());

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const m = e.target.value as ThemeMode;
    setMode(m);
    setThemeMode(m);
  }

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span>Theme</span>
      <select aria-label="Theme" value={mode} onChange={onChange} data-testid="theme-select">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  );
}
