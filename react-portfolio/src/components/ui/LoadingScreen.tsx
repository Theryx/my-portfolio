import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="loading-screen"
      role="status"
      aria-label="Loading"
    >
      <div className="loading-screen__spinner" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </motion.div>
  );
}
