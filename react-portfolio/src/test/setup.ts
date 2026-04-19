import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn().mockImplementation((options: { top?: number }) => {
    if (options && typeof options === 'object') {
      window.scrollY = options.top || 0;
    }
  }),
});