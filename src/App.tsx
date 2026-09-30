import { useState, useEffect, useMemo, useCallback } from 'react';
import type { RawRouteData, DeliveryStop } from './types/route';
import { SAMPLE_ROUTE_DATA } from './data/sampleRoute';
import { buildDeliveryStops, checkNextStreetTransition } from './utils/routeUtils';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { CurrentDeliveryCard } from './components/CurrentDeliveryCard';
import { PreviousStop } from './components/PreviousStop';
import { UpcomingStops } from './components/UpcomingStops';
import { NavigationControls } from './components/NavigationControls';
import { RouteOverview } from './components/RouteOverview';
import { JsonImporter } from './components/JsonImporter';
import { ContinueModal } from './components/ContinueModal';
import { SettingsModal } from './components/SettingsModal';
import { TourCompleteModal } from './components/TourCompleteModal';
import { useSwipe } from './hooks/useSwipe';
import { MapPin } from 'lucide-react';

const STORAGE_KEYS = {
  ROUTE_DATA: 'ze_route_data',
  CURRENT_INDEX: 'ze_current_index',
  COMPLETED_SET: 'ze_completed_stops',
  THEME: 'ze_theme_preference',
  GROUP_MULTI: 'ze_group_multipaper',
  HAPTIC: 'ze_haptic_feedback',
};

export function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Preferences
  const [groupMultiPapers, setGroupMultiPapers] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUP_MULTI);
    return saved !== null ? saved === 'true' : true;
  });

  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HAPTIC);
    return saved !== null ? saved === 'true' : true;
  });

  // Raw Route Data
  const [routeData, setRouteData] = useState<RawRouteData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTE_DATA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SAMPLE_ROUTE_DATA;
      }
    }
    return SAMPLE_ROUTE_DATA;
  });

  // Processed stops
  const stops: DeliveryStop[] = useMemo(() => {
    return buildDeliveryStops(routeData, groupMultiPapers);
  }, [routeData, groupMultiPapers]);

  // Current delivery index
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedStops, setCompletedStops] = useState<Set<number>>(new Set());

  // Modals & Sheets
  const [showOverview, setShowOverview] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTourComplete, setShowTourComplete] = useState(false);
  const [resumePromptIndex, setResumePromptIndex] = useState<number | null>(null);

  // Apply dark mode class to html document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  // Check saved progress on initial mount
  useEffect(() => {
    const savedIndexStr = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
    if (savedIndexStr) {
      const savedIndex = parseInt(savedIndexStr, 10);
      if (!isNaN(savedIndex) && savedIndex > 0 && savedIndex < stops.length) {
        setResumePromptIndex(savedIndex);
      }
    }

    const savedCompletedStr = localStorage.getItem(STORAGE_KEYS.COMPLETED_SET);
    if (savedCompletedStr) {
      try {
        const parsed = JSON.parse(savedCompletedStr);
        if (Array.isArray(parsed)) {
          setCompletedStops(new Set(parsed));
        }
      } catch {
        // ignore
      }
    }
  }, [stops.length]);

  // Save state on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, currentIndex.toString());
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SET, JSON.stringify(Array.from(completedStops)));
  }, [currentIndex, completedStops]);

  // Trigger haptic vibration if enabled
  const triggerHaptic = useCallback(() => {
    if (hapticEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Ignore vibration errors
      }
    }
  }, [hapticEnabled]);

  // Navigation actions
  const handleGoNext = useCallback(() => {
    if (currentIndex < stops.length - 1) {
      // Mark current as completed
      setCompletedStops(prev => {
        const updated = new Set(prev);
        updated.add(currentIndex);
        return updated;
      });
      setCurrentIndex(prev => prev + 1);
      triggerHaptic();
    } else if (currentIndex === stops.length - 1) {
      // Last stop reached
      setCompletedStops(prev => {
        const updated = new Set(prev);
        updated.add(currentIndex);
        return updated;
      });
      setShowTourComplete(true);
      triggerHaptic();
    }
  }, [currentIndex, stops.length, triggerHaptic]);

  const handleGoPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      triggerHaptic();
    }
  }, [currentIndex, triggerHaptic]);

  const handleSelectStop = useCallback((index: number) => {
    if (index >= 0 && index < stops.length) {
      setCurrentIndex(index);
      triggerHaptic();
    }
  }, [stops.length, triggerHaptic]);

  // Handle Route Load
  const handleLoadNewRoute = (data: RawRouteData) => {
    setRouteData(data);
    localStorage.setItem(STORAGE_KEYS.ROUTE_DATA, JSON.stringify(data));
    setCurrentIndex(0);
    setCompletedStops(new Set());
    localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, '0');
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SET, JSON.stringify([]));
    setResumePromptIndex(null);
  };

  // Reset Progress
  const handleResetProgress = () => {
    setCurrentIndex(0);
    setCompletedStops(new Set());
    localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, '0');
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SET, JSON.stringify([]));
  };

  // Swipe navigation hook
  const swipeHandlers = useSwipe(handleGoNext, handleGoPrevious, 55);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        handleGoNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleGoPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoNext, handleGoPrevious]);

  const currentStop = stops[currentIndex] || stops[0];
  const previousStop = currentIndex > 0 ? stops[currentIndex - 1] : null;
  const nextStop1 = currentIndex + 1 < stops.length ? stops[currentIndex + 1] : null;
  const nextStop2 = currentIndex + 2 < stops.length ? stops[currentIndex + 2] : null;

  const nextStreet = checkNextStreetTransition(stops, currentIndex);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <Header
        routeMeta={routeData.route}
        currentIndex={currentIndex}
        totalStops={stops.length}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
        onOpenOverview={() => setShowOverview(true)}
        onOpenImporter={() => setShowImporter(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Progress Bar */}
      <ProgressBar current={currentIndex + 1} total={stops.length} />

      {/* Main Container */}
      <main
        {...swipeHandlers}
        className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 md:p-6 flex flex-col justify-between"
      >
        {/* Pickup Notice (subtle info strip if available) */}
        {routeData.route.pickup && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 flex items-center gap-2 text-xs text-blue-900 dark:text-blue-300">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
            <span className="truncate">
              <strong>Pickup:</strong> {routeData.route.pickup}
            </span>
          </div>
        )}

        {/* Responsive Delivery Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch my-auto">
          {/* Desktop Left / Previous Stop on Large Screens */}
          <div className="hidden md:flex md:col-span-3 flex-col justify-start">
            <div className="sticky top-20">
              <PreviousStop
                stop={previousStop}
                onSelect={() => previousStop && handleGoPrevious()}
              />
              <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <div className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 text-[10px]">
                  Tour Details
                </div>
                <div>Tour: {routeData.route.Tour || '1510'}</div>
                <div>Bezirk: {routeData.route.Bezirk || '214'}</div>
                <div>Ablage: {routeData.route.Ablage || '050'}</div>
                <div>Datum: {routeData.route.EDAT || '01.10.2026'}</div>
              </div>
            </div>
          </div>

          {/* Center Column: Dominant Current Delivery Card */}
          <div className="md:col-span-6 flex flex-col justify-center">
            {currentStop && (
              <CurrentDeliveryCard
                stop={currentStop}
                nextStreetTransition={nextStreet}
              />
            )}
          </div>

          {/* Desktop Right / Upcoming Stops on Large Screens */}
          <div className="hidden md:flex md:col-span-3 flex-col justify-start">
            <div className="sticky top-20">
              <UpcomingStops
                stop1={nextStop1}
                stop2={nextStop2}
                currentIndex={currentIndex}
                onSelectStop={handleSelectStop}
              />
            </div>
          </div>
        </div>

        {/* Mobile Orientation Row (Previous Stop & Next Stops side by side) */}
        <div className="grid grid-cols-2 gap-3 mt-4 md:hidden">
          <PreviousStop
            stop={previousStop}
            onSelect={() => previousStop && handleGoPrevious()}
          />
          <UpcomingStops
            stop1={nextStop1}
            stop2={nextStop2}
            currentIndex={currentIndex}
            onSelectStop={handleSelectStop}
          />
        </div>

        {/* Bottom Fixed/Sticky Navigation Controls */}
        <div className="mt-4 pt-2 pb-1 sticky bottom-2 z-30">
          <NavigationControls
            onPrevious={handleGoPrevious}
            onNext={handleGoNext}
            canGoPrevious={currentIndex > 0}
            isLastStop={currentIndex === stops.length - 1}
          />
        </div>
      </main>

      {/* Modals and Sheets */}
      <RouteOverview
        isOpen={showOverview}
        onClose={() => setShowOverview(false)}
        stops={stops}
        currentIndex={currentIndex}
        onSelectStop={handleSelectStop}
        completedSet={completedStops}
      />

      <JsonImporter
        isOpen={showImporter}
        onClose={() => setShowImporter(false)}
        canClose={true}
        onLoadRoute={handleLoadNewRoute}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        groupMultiPapers={groupMultiPapers}
        onToggleGroupMultiPapers={(val) => {
          setGroupMultiPapers(val);
          localStorage.setItem(STORAGE_KEYS.GROUP_MULTI, String(val));
        }}
        hapticEnabled={hapticEnabled}
        onToggleHaptic={(val) => {
          setHapticEnabled(val);
          localStorage.setItem(STORAGE_KEYS.HAPTIC, String(val));
        }}
        onResetProgress={handleResetProgress}
      />

      {resumePromptIndex !== null && (
        <ContinueModal
          savedIndex={resumePromptIndex}
          totalStops={stops.length}
          onContinue={() => {
            setCurrentIndex(resumePromptIndex);
            setResumePromptIndex(null);
          }}
          onRestart={() => {
            handleResetProgress();
            setResumePromptIndex(null);
          }}
        />
      )}

      <TourCompleteModal
        isOpen={showTourComplete}
        onClose={() => setShowTourComplete(false)}
        routeMeta={routeData.route}
        stops={stops}
        onRestart={handleResetProgress}
        onOpenImporter={() => setShowImporter(true)}
      />
    </div>
  );
}

export default App;
