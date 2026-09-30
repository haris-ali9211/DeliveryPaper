import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeliveryNoteProps {
  germanNote?: string;
  englishNote?: string;
}

export const DeliveryNote: React.FC<DeliveryNoteProps> = ({ germanNote, englishNote }) => {
  if (!germanNote && !englishNote) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mt-4 w-full rounded-xl border-2 border-amber-500/80 bg-amber-50/90 dark:bg-amber-950/40 p-4 shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider text-xs sm:text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 animate-pulse" />
        <span>Delivery Instruction / Lieferhinweis</span>
      </div>

      <div className="space-y-2 text-left">
        {germanNote && (
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-amber-900/70 dark:text-amber-300/80 tracking-wide uppercase">
              DE
            </span>
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-amber-100 leading-snug">
              {germanNote}
            </p>
          </div>
        )}

        {englishNote && (
          <div className="flex flex-col pt-1 border-t border-amber-200/60 dark:border-amber-900/50">
            <span className="text-[10px] font-bold text-amber-900/60 dark:text-amber-400/70 tracking-wide uppercase">
              EN
            </span>
            <p className="text-sm sm:text-base text-slate-700 dark:text-amber-200/90 leading-snug">
              {englishNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
