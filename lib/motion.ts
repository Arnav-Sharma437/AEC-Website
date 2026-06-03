/** Shared Framer Motion defaults — viewport once, subtle timing, ease-out */

export const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;

export const VIEWPORT_ONCE_LOOSE = { once: true, amount: 0.15 } as const;

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.5,
  medium: 0.6,
  slow: 0.8,
} as const;

export const STAGGER_CHILD = 0.1;

export function transition(
  reduced: boolean | null,
  duration: number = DURATION.medium
) {
  if (reduced) return { duration: 0 };
  return { duration, ease: EASE_OUT };
}

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideFromLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
};

export const slideFromRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_CHILD, delayChildren: 0.05 },
  },
};
