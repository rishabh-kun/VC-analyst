/**
 * Tab identifiers and metadata for the 10-tab VC Analyst platform.
 */

export type TabKey =
  | 'overview'
  | 'startup_research'
  | 'founder_evaluation'
  | 'market_analysis'
  | 'competition'
  | 'financial_analysis'
  | 'risk_analysis'
  | 'investment_analyst'
  | 'investment_memo'
  | 'research_sources';

export interface TabDefinition {
  id: TabKey;
  label: string;
  shortLabel?: string;
  iconName: string;
  description: string;
}

export const VC_TABS: readonly TabDefinition[] = [
  {
    id: 'overview',
    label: 'Overview / Orchestrator',
    shortLabel: 'Overview',
    iconName: 'LayoutDashboard',
    description: 'Executive thesis, domain scorecard summary, and workflow progress.',
  },
  {
    id: 'startup_research',
    label: 'Startup Research',
    shortLabel: 'Research',
    iconName: 'Building2',
    description: 'Company profile, founding date, HQ, product value proposition, and customer segments.',
  },
  {
    id: 'founder_evaluation',
    label: 'Founder Evaluation',
    shortLabel: 'Founders',
    iconName: 'Users',
    description: 'Founding team profiles, education, previous companies, previous startups, and leadership scoring.',
  },
  {
    id: 'market_analysis',
    label: 'Market Analysis',
    shortLabel: 'Market',
    iconName: 'LineChart',
    description: 'TAM sizing, market growth estimates, industry tailwinds, and market challenges.',
  },
  {
    id: 'competition',
    label: 'Competition Analysis',
    shortLabel: 'Competition',
    iconName: 'Swords',
    description: 'Primary competitors, company moat analysis, and key differentiators.',
  },
  {
    id: 'financial_analysis',
    label: 'Financial Analysis',
    shortLabel: 'Financials',
    iconName: 'DollarSign',
    description: 'Capitalization structure, total funding, Estimated Revenue, and burn rate risks.',
  },
  {
    id: 'risk_analysis',
    label: 'Risk Analysis',
    shortLabel: 'Risks',
    iconName: 'ShieldAlert',
    description: '5-vector categorical risk heatmap and overall risk score (higher = riskier).',
  },
  {
    id: 'investment_analyst',
    label: 'Investment Analyst',
    shortLabel: 'Analyst Cockpit',
    iconName: 'Gauge',
    description: 'Decision cockpit with composite score, recommendation verdict, and reasoning.',
  },
  {
    id: 'investment_memo',
    label: 'Investment Memo',
    shortLabel: 'IC Memo',
    iconName: 'FileText',
    description: 'Formal Investment Committee Deal Memo document ready for export and print.',
  },
  {
    id: 'research_sources',
    label: 'Research Sources',
    shortLabel: 'Sources',
    iconName: 'Link2',
    description: 'Verified web search citations, domain tags, and external references.',
  },
] as const;
