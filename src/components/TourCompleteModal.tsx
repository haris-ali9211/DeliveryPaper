import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, RotateCcw, Upload, Newspaper } from 'lucide-react';
import type { DeliveryStop, RouteMeta } from '../types/route';
import { calculateRouteStats } from '../utils/routeUtils';

interface TourCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeMeta: RouteMeta;
  stops: DeliveryStop[];
  onRestart: () => void;
  onOpenImporter: () => void;
}

export const TourCompleteModal: React.FC<TourCompleteModalProps> = ({
  isOpen,
  onClose,
  routeMeta,
  stops,
  onRestart,
  onOpenImporter,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback if canvas not available
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stats = calculateRouteStats(stops);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Tour Complete!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tour {routeMeta.Tour || '1510'} · All deliveries completed successfully.
        </p>

        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalStops}
            </div>
            <div className="text-xs uppercase font-bold text-slate-400">
              Stops Delivered
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-center">
            <Newspaper className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalCopies}
            </div>
            <div className="text-xs uppercase font-bold text-slate-400">
              Papers Distributed
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            Review Route Details
          </button>

          <button
            type="button"
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Route from Beginning</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenImporter();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Load a Different Route</span>
          </button>
        </div>
      </div>
    </div>
  );
};
