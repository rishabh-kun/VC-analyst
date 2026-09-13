import React from 'react';
import { Search, Clock, Loader2, FileQuestion, AlertOctagon, LucideIcon } from 'lucide-react';

export type EmptyStateVariant =
  | 'no-analysis'
  | 'pending'
  | 'running'
  | 'unavailable'
  | 'error';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const DEFAULT_CONFIGS: Record<
  EmptyStateVariant,
  { defaultTitle: string; defaultDesc: string; Icon: LucideIcon; iconColor: string }
> = {
  'no-analysis': {
    defaultTitle: 'No Active Diligence Session',
    defaultDesc:
      'Enter a target startup or company name above to launch the 6-agent autonomous VC due diligence pipeline.',
    Icon: Search,
    iconColor: 'text-brand-600',
  },
  pending: {
    defaultTitle: 'Pipeline Stage Pending',
    defaultDesc:
      'This analysis module will activate once prior pipeline stages have validated company background data.',
    Icon: Clock,
    iconColor: 'text-amber-500',
  },
  running: {
    defaultTitle: 'Autonomous Agent In Progress',
    defaultDesc:
      'Web retrieval, entity extraction, and domain evaluation are currently processing for this sector.',
    Icon: Loader2,
    iconColor: 'text-brand-600 animate-spin',
  },
  unavailable: {
    defaultTitle: 'Data Not Publicly Disclosed',
    defaultDesc:
      'No factual disclosures or verified corporate filings were identified for this specific data point.',
    Icon: FileQuestion,
    iconColor: 'text-gray-400',
  },
  error: {
    defaultTitle: 'Workflow Execution Issue',
    defaultDesc:
      'An error occurred during agent execution. Please inspect backend service logs or retry the query.',
    Icon: AlertOctagon,
    iconColor: 'text-red-600',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'no-analysis',
  title,
  description,
  action,
  icon: CustomIcon,
  className = '',
}) => {
  const config = DEFAULT_CONFIGS[variant];
  const Icon = CustomIcon || config.Icon;

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-steel-subtle bg-white shadow-sm space-y-4 ${className}`}
      role="region"
      aria-label={title || config.defaultTitle}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-steel-subtle flex items-center justify-center">
        <Icon className={`w-6 h-6 ${config.iconColor}`} />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          {title || config.defaultTitle}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          {description || config.defaultDesc}
        </p>
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
