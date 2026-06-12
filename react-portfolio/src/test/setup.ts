import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// jsdom has no IntersectionObserver; report everything as immediately
// in-view so framer-motion's whileInView animations resolve in tests.
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
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