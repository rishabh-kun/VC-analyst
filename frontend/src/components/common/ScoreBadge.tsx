import React from 'react';

export interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  maxScore = 10,
  label,
  size = 'md',
  className = '',
}) => {
  // Color classification (Standard domains: Higher score = Better performance)
  let colorClass = 'bg-red-50 text-red-700 border-red-200';
  if (score >= 8.5) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (score >= 7.0) {
    colorClass = 'bg-cyan-50 text-cyan-700 border-cyan-200';
  } else if (score >= 5.0) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-mono tabular-nums font-semibold ${sizeStyles[size]} ${colorClass} ${className}`}
      title={label ? `${label}: ${score.toFixed(1)}/${maxScore}` : `${score.toFixed(1)}/${maxScore}`}
    >
      {label && <span className="font-sans font-medium text-gray-600 text-[11px]">{label}</span>}
      <span>{score.toFixed(1)}</span>
      <span className="text-gray-500 font-normal text-[10px]">/{maxScore}</span>
    </span>
  );
};
