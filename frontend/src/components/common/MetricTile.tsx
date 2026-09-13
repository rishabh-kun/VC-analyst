import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface MetricTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  isMonospace?: boolean;
  className?: string;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  badge,
  isMonospace = true,
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-xl bg-white border border-steel-subtle shadow-sm space-y-1.5 ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium tracking-wide uppercase text-[11px] text-gray-500">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-brand-600 shrink-0" />}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div
          className={`text-xl font-bold text-gray-900 tracking-tight ${
            isMonospace ? 'font-mono tabular-nums' : ''
          }`}
        >
          {value}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {subValue && (
        <div className="text-[11px] text-gray-500 truncate">{subValue}</div>
      )}
    </div>
  );
};
