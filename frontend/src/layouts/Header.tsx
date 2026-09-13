import React from 'react';
import { Cpu, Search } from 'lucide-react';

export interface HeaderProps {
  onNewAnalysisClick?: () => void;
  isAnalyzing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewAnalysisClick,
  isAnalyzing = false,
}) => {
  return (
    <header className="border-b border-steel-subtle bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm text-white shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-gray-900">VC Analyst</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-brand-50 text-brand-600 border border-brand-200">
                INTELLIGENCE
              </span>
            </div>
            <span className="hidden sm:block text-xs text-gray-500 font-medium">
              Autonomous 6-Agent Due Diligence Platform
            </span>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          {onNewAnalysisClick && (
            <button
              type="button"
              onClick={onNewAnalysisClick}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-steel-subtle bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-medium transition shadow-sm focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5 text-brand-600" />
              <span>New Diligence</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-verdict-emerald animate-pulse"></span>
            <span className="hidden md:inline">FastAPI Core Online</span>
            <span className="md:hidden">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
