import React, { useState, useEffect, useRef } from 'react';
import type { DeliveryStop } from '../types/route';
import { X, Search, Check, ArrowRight, Newspaper, AlertTriangle } from 'lucide-react';
import { calculateRouteStats } from '../utils/routeUtils';

interface RouteOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  stops: DeliveryStop[];
  currentIndex: number;
  onSelectStop: (index: number) => void;
  completedSet: Set<number>;
}

export const RouteOverview: React.FC<RouteOverviewProps> = ({
  isOpen,
  onClose,
  stops,
  currentIndex,
  onSelectStop,
  completedSet,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const currentItemRef = useRef<HTMLButtonElement>(null);

  // Auto scroll to current stop when modal opens
  useEffect(() => {
    if (isOpen && activeTab === 'list' && currentItemRef.current) {
      setTimeout(() => {
        currentItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const filteredStops = stops.filter(s => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const address = `${s.street} ${s.houseNumber}`.toLowerCase();
    const customer = s.customer.toLowerCase();
    const pubs = s.publications.map(p => `${p.newspaper} ${p.newspaperFullName || ''}`).join(' ').toLowerCase();
    return address.includes(term) || customer.includes(term) || pubs.includes(term);
  });

  const stats = calculateRouteStats(stops);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-2xl max-h-[90vh] h-[85vh] sm:h-auto flex flex-col rounded-t-3xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Route Overview"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Route Overview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stops.length} stops · {completedSet.size} completed
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-200 dark:bg-slate-800 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'list'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Stops
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'stats'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Stats
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close overview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          <>
            {/* Search Input */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter by street, customer or paper..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2">
              {filteredStops.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No delivery stops match "{search}"
                </div>
              ) : (
                filteredStops.map((stop) => {
                  const originalIndex = stop.stopNumber - 1;
                  const isCurrent = originalIndex === currentIndex;
                  const isCompleted = completedSet.has(originalIndex);

                  return (
                    <button
                      key={stop.id}
                      ref={isCurrent ? currentItemRef : undefined}
                      type="button"
                      onClick={() => {
                        onSelectStop(originalIndex);
                        onClose();
                      }}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500/80 shadow-sm'
                          : isCompleted
                          ? 'opacity-65 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status Icon */}
                        <div className="flex-shrink-0 w-6 flex justify-center">
                          {isCurrent ? (
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs animate-pulse">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          ) : isCompleted ? (
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-xs font-mono font-semibold text-slate-400">
                              {String(stop.stopNumber).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        {/* Stop details */}
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className={`font-bold text-sm sm:text-base truncate ${
                              isCurrent ? 'text-blue-900 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {stop.street} {stop.houseNumber}
                            </span>
                            {(stop.deliveryNoteGerman || stop.deliveryNoteEnglish) && (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {stop.customer}
                          </div>
                        </div>
                      </div>

                      {/* Newspapers tags */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {stop.publications.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {p.newspaper}
                            {p.count > 1 ? ` ×${p.count}` : ''}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* Stats View */
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <div className="text-xs uppercase font-bold text-slate-400">Total Stops</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {stats.totalStops}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <div className="text-xs uppercase font-bold text-slate-400">Total Papers</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats.totalCopies}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-blue-500" />
                <span>Publication Breakdown</span>
              </h3>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {Object.entries(stats.paperCounts).map(([code, info]) => (
                  <div key={code} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 mr-2">
                        {code}
                      </span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {info.fullName || code}
                      </span>
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {info.count} {info.count === 1 ? 'copy' : 'copies'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Current: Stop {currentIndex + 1} of {stops.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
