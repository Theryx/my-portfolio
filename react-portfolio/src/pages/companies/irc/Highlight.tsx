import { useEffect, useRef, useState, type ReactNode } from 'react';

// A plum highlighter wash that wipes in once the phrase scrolls into view.
export default function Highlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  // Without IntersectionObserver (old browsers, tests) the mark shows at once.
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <mark ref={ref} className={`cn-hl${seen ? ' is-in' : ''}`}>
      {children}
    </mark>
  );
}
