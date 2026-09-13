import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'raised' | 'interactive';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-steel-subtle shadow-sm',
    raised: 'bg-white border-steel-default shadow-md',
    interactive:
      'bg-white border-steel-subtle hover:border-steel-emphasis hover:shadow-md transition-all duration-200 cursor-pointer',
  };

  return (
    <div
      className={`rounded-2xl border p-6 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
