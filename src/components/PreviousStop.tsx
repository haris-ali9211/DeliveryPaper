import React from 'react';
import type { DeliveryStop } from '../types/route';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface PreviousStopProps {
  stop: DeliveryStop | null;
  onSelect?: () => void;
}

export const PreviousStop: React.FC<PreviousStopProps> = ({ stop, onSelect }) => {
  if (!stop) {
    return (
      <div className="h-full min-h-[110px] sm:min-h-[120px] rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-3 sm:p-4 flex flex-col justify-center items-center text-center opacity-40">
        <span className="text-xs uppercase font-medium tracking-wider text-slate-400 dark:text-slate-500">
          Previous Stop
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-600 mt-1">
          Route start
        </span>
      </div>
    );
  }

  // Publication codes comma separated
  const pubCodes = stop.publications.map(p => `${p.newspaper}${p.count > 1 ? ` ×${p.count}` : ''}`).join(', ');

  return (
    <button
      type="button"
      onClick={onSelect}
      title="Click to return to previous stop"
      className="w-full h-full text-left rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 p-3 sm:p-4 transition-all hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-[0.99] group opacity-75 hover:opacity-100"
    >
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Previous ({stop.stopNumber})</span>
        </div>
        <RotateCcw className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm sm:text-base truncate leading-snug">
        {stop.street} {stop.houseNumber}
      </div>

      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
        {stop.customer}
      </div>

      <div className="mt-1.5">
        <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {pubCodes}
        </span>
      </div>
    </button>
  );
};
