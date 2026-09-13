import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { RiskLevel } from '../../types/agents';

export interface RiskBadgeProps {
  /**
   * Categorical risk level ('Low' | 'Medium' | 'High')
   * or numerical overall_risk_score (0.0 - 10.0).
   */
  level?: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  // Determine normalized risk tier:
  // HIGHER score = HIGHER risk!
  // 0.0 - 3.9 = Low Risk (Emerald)
  // 4.0 - 6.9 = Medium Risk (Amber)
  // 7.0 - 10.0 = High Risk (Crimson)
  let tier: 'low' | 'medium' | 'high' = 'medium';
  let displayLabel = level || 'Medium';

  if (score !== undefined) {
    if (score < 4.0) {
      tier = 'low';
      displayLabel = `Low Risk (${score.toFixed(1)}/10)`;
    } else if (score < 7.0) {
      tier = 'medium';
      displayLabel = `Med Risk (${score.toFixed(1)}/10)`;
    } else {
      tier = 'high';
      displayLabel = `High Risk (${score.toFixed(1)}/10)`;
    }
  } else if (level) {
    const norm = level.toLowerCase();
    if (norm.includes('low')) tier = 'low';
    else if (norm.includes('high') || norm.includes('critical')) tier = 'high';
    else tier = 'medium';
  }

  const tierStyles = {
    low: {
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Icon: ShieldCheck,
    },
    medium: {
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
      Icon: Shield,
    },
    high: {
      colorClass: 'bg-red-50 text-red-700 border-red-200',
      Icon: ShieldAlert,
    },
  };

  const { colorClass, Icon } = tierStyles[tier];

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border tracking-wide uppercase ${sizeStyles[size]} ${colorClass} ${className}`}
      role="status"
      aria-label={`Risk Level: ${displayLabel}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span>{displayLabel}</span>
    </span>
  );
};
