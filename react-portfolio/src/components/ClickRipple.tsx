import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const ClickRipple: React.FC = () => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const handleClick = (e: MouseEvent) => {
      const newRipple = { x: e.clientX, y: e.clientY, id: idCounter++ };
      setRipples((prev) => [...prev, newRipple]);

      // Remove the ripple after the animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: ripple.y - 20, // Center the 40px circle
              left: ripple.x - 20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
