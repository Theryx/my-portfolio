// Shared bento motion language — same spring + stagger as the home mosaic.

export const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export const tileVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
};
