import React from 'react';
import { StepProgressItem, StepStatus } from '../../types/api';
import { CheckCircle2, Loader2, Circle, AlertCircle, LucideIcon } from 'lucide-react';

export interface AgentStepCardProps {
  stepKey: string;
  step: StepProgressItem;
  icon?: LucideIcon;
  stepNumber?: number;
  className?: string;
}

export const AgentStepCard: React.FC<AgentStepCardProps> = ({
  step,
  icon: CustomIcon,
  stepNumber,
  className = '',
}) => {
  const statusConfigs: Record<
    StepStatus,
    { badgeClass: string; label: string; StatusIcon: LucideIcon; iconColor: string }
  > = {
    PENDING: {
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
      label: 'Pending',
      StatusIcon: Circle,
      iconColor: 'text-gray-400',
    },
    RUNNING: {
      badgeClass: 'bg-brand-50 text-brand-600 border-brand-200 animate-pulse',
      label: 'Executing...',
      StatusIcon: Loader2,
      iconColor: 'text-brand-600 animate-spin',
    },
    COMPLETED: {
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Verified',
      StatusIcon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    ERROR: {
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      label: 'Halted',
      StatusIcon: AlertCircle,
      iconColor: 'text-red-600',
    },
  };

  const currentConfig = statusConfigs[step.status] || statusConfigs.PENDING;
  const { StatusIcon } = currentConfig;

  return (
    <div
      className={`p-4 rounded-xl border bg-white shadow-sm transition-all duration-200 ${
        step.status === 'RUNNING'
          ? 'border-brand-500 shadow-md'
          : 'border-steel-subtle'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {stepNumber !== undefined && (
            <span className="w-6 h-6 rounded-lg bg-gray-100 border border-steel-subtle text-gray-600 font-mono text-xs flex items-center justify-center font-bold">
              {stepNumber}
            </span>
          )}
          {CustomIcon && (
            <div className="p-2 rounded-lg bg-brand-50 border border-brand-200 text-brand-600">
              <CustomIcon className="w-4 h-4" />
            </div>
          )}
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">{step.name}</h4>
            <p className="text-xs text-gray-500 line-clamp-1">{step.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${currentConfig.badgeClass}`}
            role="status"
            aria-label={`${step.name} status: ${currentConfig.label}`}
          >
            <StatusIcon className={`w-3.5 h-3.5 ${currentConfig.iconColor}`} />
            <span>{currentConfig.label}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
