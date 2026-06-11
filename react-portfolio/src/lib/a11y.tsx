import type { KeyboardEvent } from 'react';

/**
 * Props for a non-button element that opens a lightbox/dialog on click,
 * making it reachable and operable from the keyboard.
 */
export function lightboxTrigger(open: () => void, label: string) {
  return {
    onClick: open,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    },
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
  };
}
