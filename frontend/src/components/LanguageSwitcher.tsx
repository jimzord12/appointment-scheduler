import { useEffect, useSyncExternalStore } from 'react';

import { getLanguage, initI18nFromCache, setLanguage, subscribeI18n } from '../lib/i18n/index.js';

export function LanguageSwitcher() {
  useEffect(() => {
    initI18nFromCache();
  }, []);

  const lang = useSyncExternalStore(subscribeI18n, getLanguage, getLanguage);

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span>Language</span>
      <select
        aria-label="Language"
        value={lang}
        onChange={e => setLanguage(e.target.value as 'en' | 'el')}
        data-testid="language-select"
      >
        <option value="en">English</option>
        <option value="el">Ελληνικά</option>
      </select>
    </label>
  );
}
