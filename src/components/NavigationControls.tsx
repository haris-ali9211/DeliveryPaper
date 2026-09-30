import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  isLastStop: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  isLastStop,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex items-stretch gap-3 pt-2">
      {/* Previous Button (Secondary) */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous Stop"
        className={`flex-1 sm:flex-initial sm:min-w-[120px] h-14 sm:h-16 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all select-none focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-95 ${
          canGoPrevious
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 shadow-sm'
            : 'bg-slate-100 dark:bg-slate-900 text-slate-300 dark:text-slate-700 cursor-not-allowed border border-slate-200 dark:border-slate-800'
        }`}
      >
        <ArrowLeft className="w-5 h-5 flex-shrink-0" />
        <span>Prev</span>
      </button>

      {/* Next Button (Primary & Dominant) */}
      <button
        type="button"
        onClick={onNext}
        aria-label={isLastStop ? 'Complete Delivery Route' : 'Deliver and Next Stop'}
        className={`flex-[3] sm:flex-1 h-14 sm:h-16 rounded-xl flex items-center justify-center gap-3 font-extrabold text-lg sm:text-xl transition-all select-none shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/40 ${
          isLastStop
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/30'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 dark:shadow-emerald-950/50'
        }`}
      >
        {isLastStop ? (
          <>
            <span>Finish Route</span>
            <Check className="w-6 h-6 stroke-[3]" />
          </>
        ) : (
          <>
            <span className="tracking-wide">NEXT STOP</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </>
        )}
      </button>
    </div>
  );
};
