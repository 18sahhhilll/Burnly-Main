import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// --- Animation Variants ---

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.43, 0.13, 0.23, 0.96],
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const numberVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const ghostVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 15,
    rotate: -5,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      rotate: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  },
};

// --- Component ---

export const NotFoundPage = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* 4 👻 4 */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-gray-100 opacity-70 font-mono select-none"
              variants={numberVariants}
              custom={-1}
            >
              4
            </motion.span>

            <motion.div
              variants={ghostVariants}
              whileHover="hover"
              animate={['visible', 'floating']}
            >
              <img
                src="https://cdn.21st.dev/assets/mirror/88/8848c4fd858052c49c5a5d7267489c02b021c6cf3e31bfec02787e16f1ab7d0e.png"
                alt="Ghost"
                width={120}
                height={120}
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain select-none"
                draggable="false"
              />
            </motion.div>

            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-gray-100 opacity-70 font-mono select-none"
              variants={numberVariants}
              custom={1}
            >
              4
            </motion.span>
          </div>

          {/* Heading */}
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-gray-100 mb-4 md:mb-6 opacity-70 select-none"
            variants={itemVariants}
          >
            Boo! Page missing!
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 opacity-50 select-none"
            variants={itemVariants}
          >
            Whoops! This page must be a ghost — it&apos;s not here!
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] },
            }}
          >
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors select-none cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Find shelter
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
