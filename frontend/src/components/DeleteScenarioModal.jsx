import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { backdropVariants, modalVariants } from '../lib/animations.js';

export const DeleteScenarioModal = ({
  isOpen,
  scenario,
  isLastScenario,
  onClose,
  onConfirmDelete,
}) => {
  return (
    <AnimatePresence>
      {isOpen && scenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative bg-[#151D2A] border border-[#222E42] rounded-xl w-full max-w-md p-6 shadow-2xl space-y-5 text-[#E8EAF0] z-10"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-[#222E42] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Delete Scenario
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1A2436] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isLastScenario ? (
              <div className="space-y-4">
                <p className="text-xs text-gray-300 leading-relaxed bg-amber-950/40 border border-amber-900/50 p-3.5 rounded-lg">
                  You cannot delete <span className="font-bold text-white">"{scenario.title}"</span> because it is your only remaining scenario. At least one scenario must remain active in Burnly.
                </p>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer active:scale-95"
                  >
                    Understood
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-white">"{scenario.title}"</span>? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white bg-[#1A2436] border border-[#222E42] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onConfirmDelete(scenario._id || scenario.id);
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Scenario
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
