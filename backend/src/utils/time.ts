// Utility helpers for time/date normalization
// Keep small and dependency-free to allow usage in both DB and in-memory flows.

// Normalize a time string to HH:MM (24h). Accepts H:MM or HH:MM.
// If input does not match expected pattern, returns it unchanged (validation occurs elsewhere).
export function normalizeHhMm(input: string): string {
  const m = /^([0-1]?\d|2[0-3]):([0-5]\d)$/.exec(input);
  if (!m) return input;
  const hour = m[1].padStart(2, '0');
  const minute = m[2];
  return `${hour}:${minute}`;
}
