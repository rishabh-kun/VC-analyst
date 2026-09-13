import React from 'react';
import { Zap, CreditCard, Database, Globe } from 'lucide-react';

export interface ExamplePillsProps {
  onSelect?: (companyName: string) => void;
  disabled?: boolean;
  className?: string;
}

const EXAMPLES = [
  { name: 'OpenAI', icon: Zap, color: 'text-amber-500' },
  { name: 'Stripe', icon: CreditCard, color: 'text-indigo-600' },
  { name: 'Databricks', icon: Database, color: 'text-cyan-600' },
  { name: 'SpaceX', icon: Globe, color: 'text-emerald-600' },
];

export const ExamplePills: React.FC<ExamplePillsProps> = ({
  onSelect,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 flex-wrap text-xs text-gray-500 ${className}`}>
      <span className="font-medium text-gray-500">Quick Examples:</span>
      {EXAMPLES.map(({ name, icon: Icon, color }) => (
        <button
          key={name}
          type="button"
          disabled={disabled}
          onClick={() => onSelect?.(name)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-steel-subtle bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 shadow-sm transition text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
};
