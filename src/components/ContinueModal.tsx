import React from 'react';
import { Play, RotateCcw, Compass } from 'lucide-react';

interface ContinueModalProps {
  savedIndex: number;
  totalStops: number;
  onContinue: () => void;
  onRestart: () => void;
}

export const ContinueModal: React.FC<ContinueModalProps> = ({
  savedIndex,
  totalStops,
  onContinue,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-4">
          <Compass className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Resume Route?
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          You previously reached stop{' '}
          <strong className="text-slate-900 dark:text-white font-extrabold">
            {savedIndex + 1}
          </strong>{' '}
          of{' '}
          <strong className="text-slate-900 dark:text-white font-extrabold">
            {totalStops}
          </strong>
          .
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continue from stop {savedIndex + 1} of {totalStops}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart from Stop 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
