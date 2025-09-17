import '@testing-library/jest-dom';
import { server } from './mocks/server.js';

// Polyfill for HTMLFormElement.requestSubmit in JSDOM
// JSDOM may define a stub that throws "Not implemented"; override to a safe fallback.
try {
  const g = globalThis as unknown as { HTMLFormElement?: { prototype?: unknown } };
  const proto = g.HTMLFormElement?.prototype as unknown as
    | (HTMLFormElement & { constructor: { prototype: HTMLFormElement } })
    | undefined;
  if (proto) {
    Object.defineProperty(proto, 'requestSubmit', {
      configurable: true,
      writable: true,
      value: function requestSubmit(this: HTMLFormElement, submitter?: unknown) {
        // If a submitter (button/input) is provided, try to click it to simulate native behavior
        if (submitter && typeof (submitter as { click?: () => void }).click === 'function') {
          (submitter as { click: () => void }).click();
          return;
        }
        // Otherwise, dispatch a submit event on the form
        const event = new Event('submit', { bubbles: true, cancelable: true });
        this.dispatchEvent(event);
      },
    });
  }
} catch {
  // noop - tests can proceed without the polyfill if environment forbids override
}

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
