import React from 'react';
import { X, Sliders, RotateCcw, Smartphone, Keyboard, Layers } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupMultiPapers: boolean;
  onToggleGroupMultiPapers: (value: boolean) => void;
  hapticEnabled: boolean;
  onToggleHaptic: (value: boolean) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  groupMultiPapers,
  onToggleGroupMultiPapers,
  hapticEnabled,
  onToggleHaptic,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <Sliders className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delivery Preferences</h3>
        </div>

        <div className="space-y-4">
          {/* Grouping Toggle */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Group Multi-Paper Stops
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Combine multiple newspapers for the same customer into a single physical stop.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={groupMultiPapers}
                onChange={(e) => onToggleGroupMultiPapers(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Haptic feedback */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Haptic Feedback
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Gentle vibration when navigating stops on mobile phones.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={hapticEnabled}
                onChange={(e) => onToggleHaptic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              <Keyboard className="w-4 h-4" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-500">Next stop</span>
                <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-bold bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700">
                  → / Space
                </kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-500">Prev stop</span>
                <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-bold bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700">
                  ←
                </kbd>
              </div>
            </div>
          </div>

          {/* Reset route progress */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset route progress back to Stop 1?')) {
                  onResetProgress();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress to Stop 1</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
