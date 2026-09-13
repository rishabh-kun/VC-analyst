import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';

export interface KeyInsightsListProps {
  items?: string[] | null;
  variant?: 'opportunity' | 'challenge' | 'strength' | 'risk' | 'neutral';
  emptyMessage?: string;
  className?: string;
}

export const KeyInsightsList: React.FC<KeyInsightsListProps> = ({
  items,
  variant = 'neutral',
  emptyMessage = 'No specific insights recorded.',
  className = '',
}) => {
  if (!items || items.length === 0) {
    return (
      <div className={`p-4 rounded-xl bg-gray-50 border border-steel-subtle text-xs text-gray-500 italic ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  const variantConfigs = {
    opportunity: {
      Icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      itemBg: 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-200',
      textColor: 'text-gray-800',
    },
    strength: {
      Icon: ShieldCheck,
      iconColor: 'text-cyan-600',
      itemBg: 'bg-cyan-50/70 hover:bg-cyan-50 border-cyan-200',
      textColor: 'text-gray-800',
    },
    challenge: {
      Icon: AlertTriangle,
      iconColor: 'text-amber-600',
      itemBg: 'bg-amber-50/70 hover:bg-amber-50 border-amber-200',
      textColor: 'text-gray-800',
    },
    risk: {
      Icon: AlertCircle,
      iconColor: 'text-red-600',
      itemBg: 'bg-red-50/70 hover:bg-red-50 border-red-200',
      textColor: 'text-gray-800',
    },
    neutral: {
      Icon: ChevronRight,
      iconColor: 'text-brand-600',
      itemBg: 'bg-gray-50 hover:bg-gray-100/80 border-steel-subtle',
      textColor: 'text-gray-700',
    },
  };

  const { Icon, iconColor, itemBg, textColor } = variantConfigs[variant] || variantConfigs.neutral;

  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item, idx) => (
        <li
          key={idx}
          className={`flex items-start gap-3 p-3 rounded-xl border text-xs leading-relaxed transition-colors ${itemBg}`}
        >
          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
          <span className={textColor}>{item}</span>
        </li>
      ))}
    </ul>
  );
};
