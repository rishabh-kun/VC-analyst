import React from 'react';
import { VCRecommendation } from '../../types/agents';
import { Award, CheckCircle2, Eye, Ban } from 'lucide-react';

export interface RecommendationBadgeProps {
  recommendation: VCRecommendation;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({
  recommendation,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const norm = (recommendation || '').toLowerCase();

  let colorClass = 'bg-red-50 text-red-700 border-red-200';
  let Icon = Ban;
  let canonicalLabel = 'Do Not Invest';

  if (norm.includes('strong invest')) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = Award;
    canonicalLabel = 'Strong Invest';
  } else if (norm.includes('invest')) {
    colorClass = 'bg-cyan-50 text-cyan-700 border-cyan-200';
    Icon = CheckCircle2;
    canonicalLabel = 'Invest';
  } else if (norm.includes('watch')) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = Eye;
    canonicalLabel = 'Watch';
  }

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5 font-bold',
    lg: 'text-base px-4 py-2 gap-2 font-black tracking-wide',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-xl border font-sans uppercase tracking-wider ${sizeStyles[size]} ${colorClass} ${className}`}
      role="status"
      aria-label={`Investment Committee Recommendation: ${canonicalLabel}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span>{canonicalLabel}</span>
    </span>
  );
};
