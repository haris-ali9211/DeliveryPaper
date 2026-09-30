import React, { useState, useEffect } from 'react';
import type { DeliveryStop } from '../types/route';
import { DeliveryNote } from './DeliveryNote';
import { Compass, Layers, CornerDownRight, Copy, Check } from 'lucide-react';

interface CurrentDeliveryCardProps {
  stop: DeliveryStop;
  nextStreetTransition: string | null;
}

export const CurrentDeliveryCard: React.FC<CurrentDeliveryCardProps> = ({
  stop,
  nextStreetTransition,
}) => {
  const isMultiPub = stop.publications.length > 1;
  const [copied, setCopied] = useState(false);

  // Reset copied state when stop changes
  useEffect(() => {
    setCopied(false);
  }, [stop.id]);

  const handleCopyAddress = async () => {
    const fullAddress = `${stop.street} ${stop.houseNumber}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullAddress);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullAddress;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failures
    }
  };

  return (
    <div className="w-full flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-4 sm:p-6 md:p-8 transition-all">
      {/* Top Meta: Stop Number & Optional Next Street Transition */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold tracking-wider uppercase">
          <Compass className="w-3.5 h-3.5 text-blue-500" />
          <span>Stop #{stop.stopNumber}</span>
        </div>

        {nextStreetTransition && (
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/60">
            <CornerDownRight className="w-3.5 h-3.5" />
            <span>Next: {nextStreetTransition}</span>
          </div>
        )}
      </div>

      {/* Main Focus Area: Address (Clickable to Copy) & Customer */}
      <div className="text-center my-1 sm:my-2 px-1 flex flex-col items-center">
        <button
          type="button"
          onClick={handleCopyAddress}
          title="Click to copy address"
          className="group relative inline-flex items-center justify-center gap-2 max-w-full px-2.5 py-1 -mx-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase font-sans truncate sm:whitespace-normal">
            {stop.street} {stop.houseNumber}
          </h1>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all flex-shrink-0 ${
              copied
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/40'
                : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
          </span>
        </button>

        <div className="mt-1 text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 truncate max-w-full">
          {stop.customer}
        </div>
      </div>

      {/* Newspaper Section */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {isMultiPub && (
          <div className="flex items-center justify-center gap-1.5 mb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Deliver {stop.publications.reduce((sum, p) => sum + p.count, 0)} Newspapers</span>
          </div>
        )}

        <div className={`space-y-3 ${isMultiPub ? 'divide-y divide-slate-100 dark:divide-slate-800' : ''}`}>
          {stop.publications.map((pub, idx) => {
            const daysLabel = pub.days.length > 0 
              ? (pub.days.includes('tgl') ? 'Daily (tgl)' : pub.days.join(' · ')) 
              : 'Daily';

            return (
              <div
                key={`${pub.newspaper}-${idx}`}
                className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-3' : ''}`}
              >
                {/* Short Code Badge + Count */}
                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-2xl sm:text-3xl tracking-tight shadow-sm">
                    {pub.newspaper}
                  </span>

                  <span className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/90 px-2.5 py-1 rounded-lg">
                    {pub.count === 1 ? '1 copy' : `× ${pub.count} copies`}
                  </span>
                </div>

                {/* Full Newspaper Name */}
                {pub.newspaperFullName && (
                  <div className="mt-2 text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {pub.newspaperFullName}
                  </div>
                )}

                {/* Days Schedule */}
                <div className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  {daysLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Note (DE / EN) */}
      <DeliveryNote
        germanNote={stop.deliveryNoteGerman}
        englishNote={stop.deliveryNoteEnglish}
      />
    </div>
  );
};
