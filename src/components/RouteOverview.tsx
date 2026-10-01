import React, { useState, useEffect, useRef } from 'react';
import type { DeliveryStop } from '../types/route';
import { X, Search, Check, ArrowRight, Newspaper, AlertTriangle, GripVertical, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import { calculateRouteStats } from '../utils/routeUtils';

interface RouteOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  stops: DeliveryStop[];
  currentIndex: number;
  onSelectStop: (index: number) => void;
  completedSet: Set<number>;
  onReorderStops?: (newStops: DeliveryStop[]) => void;
  isCustomOrder?: boolean;
  onResetOrder?: () => void;
}

export const RouteOverview: React.FC<RouteOverviewProps> = ({
  isOpen,
  onClose,
  stops,
  currentIndex,
  onSelectStop,
  completedSet,
  onReorderStops,
  isCustomOrder = false,
  onResetOrder,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

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

  // Handle Drag & Drop reorder
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent or custom drag preview
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex || !onReorderStops) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...stops];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);

    onReorderStops(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle Move Up / Move Down buttons
  const handleMoveStop = (e: React.MouseEvent, fromIndex: number, direction: 'up' | 'down') => {
    e.stopPropagation();
    if (!onReorderStops) return;

    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= stops.length) return;

    const updated = [...stops];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;

    onReorderStops(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] h-[88vh] sm:h-auto flex flex-col rounded-t-3xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Route Overview"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Route Overview</h2>
              {isCustomOrder && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Custom Order
                </span>
              )}
            </div>
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
            {/* Search Input & Reorder Tip */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
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

              {/* Instructions & Reset Order Button */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <span>⠿ Drag handle or use ▲/▼ to swap house stops. Tap house to jump.</span>
                {isCustomOrder && onResetOrder && (
                  <button
                    type="button"
                    onClick={onResetOrder}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 ml-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Order</span>
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
                  const actualIndex = stops.findIndex(s => s.id === stop.id);
                  const isCurrent = actualIndex === currentIndex;
                  const isCompleted = completedSet.has(actualIndex);
                  const isDraggingThis = draggedIndex === actualIndex;
                  const isOverThis = dragOverIndex === actualIndex;

                  return (
                    <div
                      key={stop.id}
                      ref={isCurrent ? currentItemRef : undefined}
                      draggable={!search}
                      onDragStart={(e) => handleDragStart(e, actualIndex)}
                      onDragOver={(e) => handleDragOver(e, actualIndex)}
                      onDrop={(e) => handleDrop(e, actualIndex)}
                      onDragEnd={handleDragEnd}
                      className={`w-full group rounded-xl flex items-center justify-between gap-1.5 transition-all select-none ${
                        isDraggingThis ? 'opacity-40 bg-slate-200 dark:bg-slate-800' : ''
                      } ${
                        isOverThis ? 'border-t-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : ''
                      } ${
                        isCurrent
                          ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-500/80 shadow-sm'
                          : isCompleted
                          ? 'opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Drag Handle */}
                      {!search && (
                        <div
                          className="pl-2 py-3 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                      )}

                      {/* House Details (Clickable to jump) */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectStop(actualIndex);
                          onClose();
                        }}
                        className="flex-1 py-3 px-2 text-left flex items-center justify-between gap-2 min-w-0"
                        title="Click to jump to this stop"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Status Icon / Number */}
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
                                {String(actualIndex + 1).padStart(2, '0')}
                              </span>
                            )}
                          </div>

                          {/* Stop details */}
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-1.5">
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

                        {/* Newspaper tags */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {stop.publications.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {p.newspaper}
                              {p.count > 1 ? ` ×${p.count}` : ''}
                            </span>
                          ))}
                        </div>
                      </button>

                      {/* Swap Buttons (Up / Down) */}
                      {!search && (
                        <div className="flex items-center pr-2 gap-0.5 flex-shrink-0">
                          <button
                            type="button"
                            disabled={actualIndex === 0}
                            onClick={(e) => handleMoveStop(e, actualIndex, 'up')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move house up"
                            aria-label="Move stop up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={actualIndex === stops.length - 1}
                            onClick={(e) => handleMoveStop(e, actualIndex, 'down')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move house down"
                            aria-label="Move stop down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
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
