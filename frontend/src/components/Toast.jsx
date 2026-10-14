import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { toastVariants } from '../lib/animations.js';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#1A2436]/95 backdrop-blur-md border border-[#222E42] text-white px-4 py-3 rounded-xl shadow-2xl"
      role="status"
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
      <span className="text-xs font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer ml-1 active:scale-95"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
