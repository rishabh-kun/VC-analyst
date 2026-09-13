import React from 'react';
import { Header } from './Header';
import { CompanyQuickBar, CompanyQuickBarProps } from './CompanyQuickBar';
import { TabNavigation } from './TabNavigation';
import { TabKey } from '../types/navigation';

export interface AppLayoutProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  companyInfo?: CompanyQuickBarProps;
  onNewAnalysisClick?: () => void;
  isAnalyzing?: boolean;
  showNavigation?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onTabChange,
  companyInfo = {},
  onNewAnalysisClick,
  isAnalyzing = false,
  showNavigation = true,
  children,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen bg-[#F6F8FB] text-[#111827] flex flex-col font-sans selection:bg-brand-600 selection:text-white ${className}`}
      style={{ backgroundColor: '#F6F8FB' }}
    >
      {/* 1. Master Header */}
      <Header
        onNewAnalysisClick={onNewAnalysisClick}
        isAnalyzing={isAnalyzing}
      />

      {/* 2. Persistent Company Quick-Bar */}
      <CompanyQuickBar
        {...companyInfo}
        isAnalyzing={isAnalyzing}
      />

      {/* 3. 10-Tab Horizontal Navigation */}
      {showNavigation && (
        <TabNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      )}

      {/* 4. Main Tab Content Shell */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative">
        {children}
      </main>

      {/* 5. Minimal Institutional Footer */}
      <footer className="border-t border-steel-subtle bg-white py-4 px-4 sm:px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Multi-Agent AI Venture Capital Analyst &bull; Institutional Diligence System</span>
          <span className="font-mono text-[11px] text-gray-400">React + TypeScript + Tailwind Architecture</span>
        </div>
      </footer>
    </div>
  );
};
