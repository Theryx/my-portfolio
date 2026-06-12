import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// jsdom has no IntersectionObserver; report everything as immediately
// in-view so framer-motion's whileInView animations resolve in tests.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
globalThis.IntersectionObserver = window.IntersectionObserver;

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn().mockImplementation((options: { top?: number }) => {
    if (options && typeof options === 'object') {
      window.scrollY = options.top || 0;
    }
  }),
});