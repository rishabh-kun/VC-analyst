import React from 'react';

export interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subLabel?: string;
  isRisk?: boolean;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  maxScore = 10,
  size = 'md',
  label,
  subLabel,
  isRisk = false,
  className = '',
}) => {
  const clampedScore = Math.max(0, Math.min(maxScore, score));
  const normalized = maxScore > 0 ? clampedScore / maxScore : 0;

  // Dimensions based on size
  const sizeMap = {
    sm: { dimension: 64, strokeWidth: 5, radius: 26, fontSize: 'text-sm', labelSize: 'text-[9px]' },
    md: { dimension: 88, strokeWidth: 6, radius: 36, fontSize: 'text-xl', labelSize: 'text-[10px]' },
    lg: { dimension: 112, strokeWidth: 8, radius: 46, fontSize: 'text-2xl', labelSize: 'text-xs' },
  };

  const { dimension, strokeWidth, radius, fontSize, labelSize } = sizeMap[size] || sizeMap.md;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - normalized * circumference;

  // Semantic color calculation
  let strokeColor = '#10B981'; // Emerald
  let textColor = 'text-verdict-emerald';
  let levelText = 'Strong';

  if (isRisk) {
    // Semantic Inverted Risk Scale: Higher = More Risk
    if (clampedScore <= 3.9) {
      strokeColor = '#10B981'; // Low Risk = Emerald
      textColor = 'text-emerald-600';
      levelText = 'Low Risk';
    } else if (clampedScore <= 6.9) {
      strokeColor = '#F59E0B'; // Medium Risk = Amber
      textColor = 'text-amber-600';
      levelText = 'Medium Risk';
    } else {
      strokeColor = '#EF4444'; // High Risk = Crimson
      textColor = 'text-red-600';
      levelText = 'High Risk';
    }
  } else {
    // Standard Scale: Higher = Better
    if (clampedScore >= 8.0) {
      strokeColor = '#10B981';
      textColor = 'text-emerald-600';
      levelText = 'Strong';
    } else if (clampedScore >= 6.5) {
      strokeColor = '#06B6D4';
      textColor = 'text-cyan-600';
      levelText = 'Favorable';
    } else if (clampedScore >= 4.0) {
      strokeColor = '#F59E0B';
      textColor = 'text-amber-600';
      levelText = 'Moderate';
    } else {
      strokeColor = '#EF4444';
      textColor = 'text-red-600';
      levelText = 'Cautious';
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="transform -rotate-90"
          aria-hidden="true"
        >
          {/* Background Track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Indicator */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-extrabold tabular-nums tracking-tight ${fontSize} ${textColor}`}>
            {clampedScore.toFixed(1)}
          </span>
          <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">
            /{maxScore}
          </span>
        </div>
      </div>

      {label && (
        <span className={`mt-2 font-medium text-gray-700 ${labelSize} text-center`}>
          {label}
        </span>
      )}
      <span className={`font-mono font-semibold text-[10px] ${textColor}`}>
        {subLabel || levelText}
      </span>
    </div>
  );
};
