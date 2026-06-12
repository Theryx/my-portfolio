import { useEffect, useRef, useState, useCallback } from 'react';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Animates a number from 0 to `target` once the observed element scrolls
 * into view. Attach the returned `setRef` callback to the element via the
 * `ref` prop. Respects prefers-reduced-motion by skipping the animation.
 */
export function useCountUp(target: number, durationMs = 1400) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  const started = useRef(false);

  const setRef = useCallback((node: HTMLElement | null) => setEl(node), []);

  useEffect(() => {
    if (!el || target <= 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        if (prefersReducedMotion()) {
          setValue(target);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, target, durationMs]);

  return [setRef, value] as const;
}
