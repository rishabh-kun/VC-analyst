import React from 'react';

export interface PipelineProgressBarProps {
  progressPercent: number; // 0 - 100
  completedCount?: number;
  totalCount?: number;
  currentStepName?: string;
  className?: string;
}

export const PipelineProgressBar: React.FC<PipelineProgressBarProps> = ({
  progressPercent,
  completedCount = 0,
  totalCount = 6,
  currentStepName,
  className = '',
}) => {
  const clampedPercent = Math.max(0, Math.min(100, Math.round(progressPercent)));

  return (
    <div className={`space-y-2 w-full ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Pipeline Execution</span>
          {currentStepName && (
            <span className="text-brand-600 font-mono text-[11px]">
              &bull; {currentStepName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 font-mono tabular-nums">
          <span>
            {completedCount}/{totalCount} Completed
          </span>
          <span className="text-gray-900 font-bold">{clampedPercent}%</span>
        </div>
      </div>

      <div
        className="w-full h-2.5 bg-gray-100 rounded-full border border-steel-subtle p-0.5 overflow-hidden shadow-inner"
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Agent Pipeline Progress"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(4, clampedPercent)}%` }}
        />
      </div>
    </div>
  );
};
