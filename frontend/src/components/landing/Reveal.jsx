import React from 'react';
import { motion } from 'framer-motion';

/**
 * Scroll-triggered reveal container.
 * Animates from slight blur + translateY + opacity to crisp focus.
 * Triggers once at 15% viewport entry.
 */
export const Reveal = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
