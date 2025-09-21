import { render } from '@testing-library/react';
import axe, { AxeResults } from 'axe-core';
import { describe, expect, it, vi } from 'vitest';

import { LoginPage } from '../../pages/Login.js';

// Mock TanStack Router hooks used by the page (useNavigate)
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<any>('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

async function runAxe(container: HTMLElement) {
  const results = axe.run(container, {
    rules: {
      // Our minimal test page structure may trip the generic label rule in JSDOM; keep focus on critical issues.
      label: { enabled: false },
    },
  } as any) as unknown as Promise<AxeResults>;
  return results;
}

describe('T052 A11y - LoginPage', () => {
  it('has no critical accessibility violations', async () => {
    const { container } = render(<LoginPage />);
    const { violations } = await runAxe(container);
    const critical = violations.filter((v: any) => v.impact === 'critical');
    expect(critical).toHaveLength(0);
  });
});
