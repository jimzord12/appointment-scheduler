import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import axe, { AxeResults, ElementContext } from 'axe-core';
import { describe, expect, it } from 'vitest';

import { AppLayout } from '../../components/layout/AppLayout.js';

async function runAxe(container: ElementContext): Promise<AxeResults> {
  const results = await axe.run(container, {
    // Keep defaults; can tune rules if needed later
  } as any);
  return results;
}

describe('T052 A11y - AppLayout', () => {
  it('has no critical accessibility violations', async () => {
    // Create a minimal router so <Outlet /> inside AppLayout has context
    const rootRoute = createRootRoute({ component: AppLayout });
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => <div />,
    });
    const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]) });
    const { container } = render(<RouterProvider router={router} />);
    const { violations } = await runAxe(container);
    const critical = violations.filter((v: any) => v.impact === 'critical');
    expect(critical).toHaveLength(0);
  });
});
