import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: LucideIcon;
  rightContent?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  rightContent,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel-subtle pb-4 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600 border border-brand-200">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {rightContent && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {rightContent}
        </div>
      )}
    </div>
  );
};
