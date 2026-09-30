import React from 'react';
import type { RouteMeta } from '../types/route';
import { Sun, Moon, List, Upload, Settings } from 'lucide-react';

interface HeaderProps {
  routeMeta: RouteMeta;
  currentIndex: number;
  totalStops: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenOverview: () => void;
  onOpenImporter: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  routeMeta,
  currentIndex,
  totalStops,
  isDarkMode,
  onToggleTheme,
  onOpenOverview,
  onOpenImporter,
  onOpenSettings,
}) => {
  const currentDisplay = totalStops > 0 ? currentIndex + 1 : 0;
  const percentage = totalStops > 0 ? Math.round((currentDisplay / totalStops) * 100) : 0;

  return (
    <header className="w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-4 py-2.5 sm:py-3 sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Tour & Meta */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-black text-sm sm:text-base text-slate-900 dark:text-white">
              <span>Tour {routeMeta.Tour || '1510'}</span>
              {routeMeta.Bezirk && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Bz {routeMeta.Bezirk}
                </span>
              )}
            </div>
            {routeMeta.EDAT && (
              <span className="text-[11px] text-slate-400 font-medium">
                {routeMeta.EDAT}
              </span>
            )}
          </div>
        </div>

        {/* Center: Unobtrusive Progress counter */}
        <div className="flex items-center gap-2 text-center">
          <div className="flex flex-col items-center">
            <span className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-none">
              {currentDisplay} <span className="text-slate-400 text-sm font-normal">/ {totalStops}</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              {percentage}% completed
            </span>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Route Overview Button */}
          <button
            type="button"
            onClick={onOpenOverview}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="View Route List"
          >
            <List className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">View Route</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Import Route Button */}
          <button
            type="button"
            onClick={onOpenImporter}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Upload Route JSON"
            title="Upload or Change Route JSON"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Preferences"
            title="Preferences & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
