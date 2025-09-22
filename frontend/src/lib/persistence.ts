type PrefRecord = {
  theme?: 'light' | 'dark' | 'system';
  language?: 'en' | 'el';
  motion?: 'default' | 'reduced';
};

const DEVICE_KEY = 'prefs:device';
const USER_KEY = (userId: string) => `prefs:user:${userId}`;

function read(key: string): PrefRecord {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as PrefRecord;
  } catch {
    return {};
  }
}

function write(key: string, value: PrefRecord) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem('userId');
}

export function loadPreferences(): PrefRecord {
  const userId = getCurrentUserId();
  const device = read(DEVICE_KEY);
  if (!userId) return device;
  const user = read(USER_KEY(userId));
  return { ...device, ...user };
}

export function savePreferences(partial: PrefRecord) {
  const userId = getCurrentUserId();
  if (userId) {
    const current = read(USER_KEY(userId));
    write(USER_KEY(userId), { ...current, ...partial });
  } else {
    const current = read(DEVICE_KEY);
    write(DEVICE_KEY, { ...current, ...partial });
  }
}
