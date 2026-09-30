import React from 'react';

interface ProgressBarProps {
  current: number; // 1-indexed
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  if (total <= 0) return null;

  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div
      className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 overflow-hidden"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label="Route delivery progress"
    >
      <div
        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
