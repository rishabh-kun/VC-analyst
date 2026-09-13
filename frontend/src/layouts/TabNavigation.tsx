import React, { useRef } from 'react';
import {
  TabKey,
  VC_TABS,
} from '../types/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  LineChart,
  Swords,
  DollarSign,
  ShieldAlert,
  Gauge,
  FileText,
  Link2,
  LucideIcon,
} from 'lucide-react';

export interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tabKey: TabKey) => void;
  className?: string;
}

const TAB_ICONS: Record<TabKey, LucideIcon> = {
  overview: LayoutDashboard,
  startup_research: Building2,
  founder_evaluation: Users,
  market_analysis: LineChart,
  competition: Swords,
  financial_analysis: DollarSign,
  risk_analysis: ShieldAlert,
  investment_analyst: Gauge,
  investment_memo: FileText,
  research_sources: Link2,
};

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation across tablist (Left/Right arrows)
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % VC_TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + VC_TABS.length) % VC_TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = VC_TABS.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = VC_TABS[nextIndex];
      onTabChange(nextTab.id);

      // Focus the newly active tab button
      const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus();
      }
    }
  };

  return (
    <div className={`border-b border-steel-subtle bg-white sticky top-16 z-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Venture Capital Analysis Domain Tabs"
          className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1.5 focus:outline-none"
        >
          {VC_TABS.map((tab, idx) => {
            const isActive = tab.id === activeTab;
            const Icon = TAB_ICONS[tab.id] || LayoutDashboard;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0 ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-sm font-bold'
                    : 'text-[#374151] hover:text-[#111827] hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-[#6B7280]'}`} />
                <span>{tab.shortLabel || tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
