import React, { useState } from 'react';
import { Building2, Rocket, Loader2 } from 'lucide-react';
import { ExamplePills } from './ExamplePills';

export interface StartupSearchFormProps {
  onSubmit?: (startupName: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  className?: string;
}

export const StartupSearchForm: React.FC<StartupSearchFormProps> = ({
  onSubmit,
  isLoading = false,
  initialValue = '',
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onSubmit?.(trimmed);
    }
  };

  const handleSelectExample = (companyName: string) => {
    setQuery(companyName);
    if (!isLoading) {
      onSubmit?.(companyName);
    }
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="startup-search-input"
          className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
        >
          Target Company or Startup
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Building2 className="w-5 h-5" />
            </div>
            <input
              id="startup-search-input"
              type="text"
              required
              disabled={isLoading}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. OpenAI, Stripe, Databricks, SpaceX..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#D1D5DB] rounded-xl text-[#111827] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-brand-500/20 shadow-sm transition disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white font-semibold rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Launching...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Analyze Startup</span>
              </>
            )}
          </button>
        </div>
      </form>

      <ExamplePills onSelect={handleSelectExample} disabled={isLoading} />
    </div>
  );
};
