import { render, screen } from '@testing-library/react';
import axe, { AxeResults, ElementContext } from 'axe-core';
import { describe, expect, it } from 'vitest';

import { LanguageSwitcher } from '../components/LanguageSwitcher.js';
import { SettingsPanel } from '../components/SettingsPanel.js';
import { ThemeToggle } from '../components/ThemeToggle.js';

async function runAxe(container: ElementContext): Promise<AxeResults> {
  const results = axe.run(container, {
    // keep defaults; disable "region" if it becomes noisy
  } as any) as unknown as Promise<AxeResults>;
  return results;
}

describe('T020 A11y - Header controls', () => {
  it('Language, Theme, and Reduced Motion controls are accessible', async () => {
    const { container } = render(
      <div>
        <LanguageSwitcher />
        <ThemeToggle />
        <SettingsPanel />
      </div>
    );
    // Controls present with labels
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Reduced motion')).toBeInTheDocument();

    const results = await runAxe(container);
    expect(results.violations).toEqual([]);
  });
});
