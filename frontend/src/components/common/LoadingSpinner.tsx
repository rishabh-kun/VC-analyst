import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 text-brand-400 font-medium ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={`${sizeStyles[size]} animate-spin shrink-0`} />
      {label && <span className="text-xs text-gray-300">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};
