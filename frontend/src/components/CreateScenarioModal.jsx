import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus } from 'lucide-react';
import { PRESET_SCENARIOS } from '../lib/presets';
import { backdropVariants, modalVariants } from '../lib/animations.js';

export const CreateScenarioModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_SCENARIOS[0].id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenPreset = PRESET_SCENARIOS.find((p) => p.id === selectedPresetId);
    const initialData = chosenPreset ? chosenPreset.data : PRESET_SCENARIOS[0].data;

    onCreate({
      title: title.trim(),
      data: JSON.parse(JSON.stringify(initialData)),
    });

    setTitle('');
    setSelectedPresetId(PRESET_SCENARIOS[0].id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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

          {/* Modal Content */}
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
                <Sparkles className="w-5 h-5 text-blue-400" />
                Create New Scenario
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1A2436] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Scenario Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Hiring & Growth Model"
                  className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3.5 py-2.5 text-sm text-white transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Starting Template / Preset
                </label>
                <div className="space-y-2">
                  {PRESET_SCENARIOS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPresetId === preset.id
                          ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                          : 'bg-[#1A2436] border-[#222E42] hover:border-gray-600'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{preset.title}</h4>
                        <p className="text-[11px] text-gray-400">
                          ₹{(preset.data.startingCash / 100000).toFixed(1)}L starting cash · {preset.data.hiringTimeline.length} hires planned
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          selectedPresetId === preset.id
                            ? 'border-blue-400 bg-blue-500'
                            : 'border-gray-600'
                        }`}
                      >
                        {selectedPresetId === preset.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white bg-[#1A2436] border border-[#222E42] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Create Scenario
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
