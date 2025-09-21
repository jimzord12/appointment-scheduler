import { describe, expect, it } from 'vitest';

import { normalizeHhMm } from '../../src/utils/time.js';

// T053: Utility/date validation unit tests — cover time normalization helper.

describe('utils/time.normalizeHhMm', () => {
  it('pads single-digit hour to HH:MM', () => {
    expect(normalizeHhMm('8:05')).toBe('08:05');
    expect(normalizeHhMm('0:00')).toBe('00:00');
    expect(normalizeHhMm('9:59')).toBe('09:59');
  });

  it('returns already normalized HH:MM unchanged', () => {
    expect(normalizeHhMm('10:00')).toBe('10:00');
    expect(normalizeHhMm('23:59')).toBe('23:59');
  });

  it('allows 00 through 23 hours, 00-59 minutes', () => {
    expect(normalizeHhMm('00:00')).toBe('00:00');
    expect(normalizeHhMm('23:59')).toBe('23:59');
  });

  it('returns input unchanged for invalid patterns (validation done elsewhere)', () => {
    expect(normalizeHhMm('24:00')).toBe('24:00'); // invalid hour
    expect(normalizeHhMm('12:60')).toBe('12:60'); // invalid minute
    expect(normalizeHhMm('7')).toBe('7'); // missing minutes
    expect(normalizeHhMm('7:5')).toBe('7:5'); // missing leading zero in minutes
    expect(normalizeHhMm('abc')).toBe('abc'); // non-numeric
    expect(normalizeHhMm('7:005')).toBe('7:005'); // wrong minute length
  });
});
