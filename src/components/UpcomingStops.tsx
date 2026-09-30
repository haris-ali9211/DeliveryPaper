import React from 'react';
import type { DeliveryStop } from '../types/route';
import { ArrowRight } from 'lucide-react';

interface UpcomingStopsProps {
  stop1: DeliveryStop | null;
  stop2: DeliveryStop | null;
  onSelectStop?: (stopIndex: number) => void;
  currentIndex: number;
}

export const UpcomingStops: React.FC<UpcomingStopsProps> = ({
  stop1,
  stop2,
  onSelectStop,
  currentIndex,
}) => {
  if (!stop1 && !stop2) {
    return (
      <div className="h-full min-h-[110px] sm:min-h-[120px] rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-3 sm:p-4 flex flex-col justify-center items-center text-center opacity-40">
        <span className="text-xs uppercase font-medium tracking-wider text-slate-400 dark:text-slate-500">
          Upcoming Stops
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-600 mt-1">
          Last delivery stop
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-3 sm:p-4 transition-all">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
        <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
        <span>Next Stops</span>
      </div>

      <div className="space-y-2">
        {stop1 && (
          <button
            type="button"
            onClick={() => onSelectStop && onSelectStop(currentIndex + 1)}
            title="Click to jump to next stop"
            className="w-full text-left p-2 -mx-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group block"
          >
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                1. {stop1.street} {stop1.houseNumber}
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded flex-shrink-0">
                {stop1.publications.map(p => `${p.newspaper}${p.count > 1 ? ` ×${p.count}` : ''}`).join(', ')}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {stop1.customer}
            </div>
          </button>
        )}

        {stop2 && (
          <button
            type="button"
            onClick={() => onSelectStop && onSelectStop(currentIndex + 2)}
            title="Click to jump to 2nd upcoming stop"
            className="w-full text-left p-2 -mx-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all group block border-t border-slate-100 dark:border-slate-800/80 pt-2"
          >
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-medium text-slate-800 dark:text-slate-300 text-xs sm:text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                2. {stop2.street} {stop2.houseNumber}
              </span>
              <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded flex-shrink-0">
                {stop2.publications.map(p => `${p.newspaper}${p.count > 1 ? ` ×${p.count}` : ''}`).join(', ')}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
              {stop2.customer}
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
