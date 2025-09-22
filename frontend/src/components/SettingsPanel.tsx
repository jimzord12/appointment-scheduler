import React from 'react';

import { preferencesStore } from '../stores/preferences.js';

export function SettingsPanel() {
  const motion = preferencesStore(s => s.motion);
  const setMotion = preferencesStore(s => s.setMotion);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="reduced-motion-toggle" style={{ display: 'inline-flex', gap: 8 }}>
        <span>Reduced motion</span>
        <input
          id="reduced-motion-toggle"
          type="checkbox"
          role="switch"
          aria-checked={motion === 'reduced'}
          checked={motion === 'reduced'}
          onChange={e => setMotion(e.target.checked ? 'reduced' : 'default')}
          data-testid="reduced-motion-toggle"
        />
      </label>
    </div>
  );
}
