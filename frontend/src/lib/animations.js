/**
 * Burnly Animation System
 * 
 * Single source of truth for all animation variants and timing constants.
 * Used throughout the app with Framer Motion.
 *
 * Design rules:
 * - Micro-interactions: 100–180 ms
 * - Input / button transitions: 150–220 ms
 * - Modal / dropdown: 180–280 ms
 * - Page transitions: 220–300 ms
 * - Entrance stagger: 250–400 ms
 *
 * Use GPU-friendly properties only: opacity, transform.
 * Never animate layout dimensions (height, width, margin) in frequent loops.
 */

// ─── Easing curves ────────────────────────────────────────────────────────────

export const ease = {
  out: [0.22, 1, 0.36, 1],       // smooth deceleration — use for entrances
  in: [0.55, 0, 1, 0.45],        // smooth acceleration — use for exits
  inOut: [0.45, 0, 0.55, 1],     // symmetrical — use for reversible states
  spring: { type: 'spring', stiffness: 380, damping: 30 }, // snappy spring
};

// ─── Page Transition ──────────────────────────────────────────────────────────

export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: ease.in },
  },
};

// ─── Fade variants ────────────────────────────────────────────────────────────

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22, ease: ease.out } },
  exit:    { opacity: 0, transition: { duration: 0.15, ease: ease.in } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: ease.out } },
  exit:    { opacity: 0, y: 6,  transition: { duration: 0.18, ease: ease.in } },
};

export const fadeDown = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: ease.out } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.16, ease: ease.in } },
};

// ─── Stagger container ────────────────────────────────────────────────────────

/** Wrap a list of `staggerItem` children with this container */
export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Child of staggerContainer */
export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: ease.out } },
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: ease.out },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 4,
    transition: { duration: 0.16, ease: ease.in },
  },
};

// ─── Dropdown / Popover ───────────────────────────────────────────────────────

export const dropdownVariants = {
  initial: { opacity: 0, scale: 0.96, y: -6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.16, ease: ease.out },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -4,
    transition: { duration: 0.12, ease: ease.in },
  },
};

// ─── Slide-in panel (sidebar drawer) ─────────────────────────────────────────

export const slideInLeft = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.28, ease: ease.out } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.22, ease: ease.in } },
};

// ─── Toast notification ───────────────────────────────────────────────────────

export const toastVariants = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.97,
    transition: { duration: 0.18, ease: ease.in },
  },
};

// ─── Card entrance ────────────────────────────────────────────────────────────

export const cardEntrance = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: ease.out },
  },
};

// ─── List item (add/remove) ───────────────────────────────────────────────────

export const listItemVariants = {
  initial: { opacity: 0, height: 0, marginBottom: 0 },
  animate: {
    opacity: 1,
    height: 'auto',
    marginBottom: 10,
    transition: { duration: 0.22, ease: ease.out },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.18, ease: ease.in },
  },
};

// ─── Tab indicator ────────────────────────────────────────────────────────────

export const tabIndicator = {
  layoutId: 'tab-indicator',
  transition: { type: 'spring', stiffness: 400, damping: 35 },
};
