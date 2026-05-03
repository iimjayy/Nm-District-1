export const springConfig = { type: 'spring', damping: 12, mass: 1, stiffness: 100 };
export const easeOutConfig = { type: 'tween', duration: 0.3, ease: 'easeOut' };

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: springConfig,
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const cardHover = {
  whileHover: { y: -4, transition: easeOutConfig },
  whileTap: { scale: 0.98 },
};

export const buttonTap = {
  whileTap: { scale: 0.96 },
};

export const pulseAnimation = {
  animate: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } },
};

export const shimmerAnimation = {
  backgroundPosition: ['0% 0%', '100% 0%'],
  transition: { repeat: Infinity, duration: 2, ease: 'linear' },
};
