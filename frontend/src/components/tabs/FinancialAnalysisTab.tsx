import React from 'react';
import { JobResultsResponse } from '../../types/api';
import {
  GlassCard,
  ScoreRing,
  SectionHeader,
  KeyInsightsList,
  EmptyState,
} from '../common';
import {
  DollarSign,
  Building,
  CreditCard,
  Award,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export interface FinancialAnalysisTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const FinancialAnalysisTab: React.FC<FinancialAnalysisTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const fin = results?.full_context?.financial_output;

  if (!fin) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Financial Analysis Unavailable"
          description={
            targetCompany
              ? `Financial analysis has not yet completed for ${targetCompany}.`
              : 'Launch due diligence to view capitalization and financial health analysis.'
          }
        />
      </GlassCard>
    );
  }

  return (
    <div
      role="tabpanel"
      id="panel-financial_analysis"
      aria-labelledby="tab-financial_analysis"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header with Capitalization Tag */}
      <SectionHeader
        title="Financial Health & Capitalization"
        subtitle="Evaluation of capital structure, estimated revenue, institutional capitalization, financial strengths, and burn risks."
        icon={DollarSign}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Financial Agent Verified
          </span>
        }
        rightContent={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-steel-subtle text-xs font-mono text-gray-700">
            <Building className="w-3.5 h-3.5 text-brand-600" />
            <span>Type: {fin.company_type || 'Private'}</span>
          </div>
        }
      />

      {/* 2. Primary KPI Grid: Emphasis on Confirmed Backend Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Revenue (Strictly NOT ARR) */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
            <span>Estimated Revenue</span>
          </span>
          <p className="text-lg sm:text-xl font-extrabold font-mono text-gray-900 tracking-tight pt-1">
            {fin.estimated_revenue || 'Not Publicly Disclosed'}
          </p>
          <span className="text-[11px] text-gray-500 block">
            Annual revenue scale indicator
          </span>
        </div>

        {/* Total Funding */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Raised Capital</span>
          </span>
          <p className="text-lg sm:text-xl font-extrabold font-mono text-emerald-600 tracking-tight pt-1">
            {fin.total_funding || 'Not Publicly Disclosed'}
          </p>
          <span className="text-[11px] text-gray-500 block">
            Cumulative equity & financing
          </span>
        </div>

        {/* Latest Round */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-cyan-600" />
            <span>Latest Funding Round</span>
          </span>
          <p className="text-base font-bold text-gray-900 tracking-tight pt-1">
            {fin.latest_funding_round || 'Not Disclosed'}
          </p>
          <span className="text-[11px] text-gray-500 block">
            Most recent financing event
          </span>
        </div>

        {/* Profitability */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Profitability Status</span>
          </span>
          <p className="text-base font-bold text-gray-900 tracking-tight pt-1">
            {fin.profitability || 'Not Disclosed'}
          </p>
          <span className="text-[11px] text-gray-500 block">
            Net operating margin indicator
          </span>
        </div>
      </div>

      {/* 3. Financial Score & Agent Justification */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-grow">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Financial Score Justification
            </span>
            <p className="text-sm text-gray-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-steel-subtle">
              {fin.score_justification || 'No specific financial score justification provided by agent.'}
            </p>
          </div>

          <div className="shrink-0 p-3 rounded-xl bg-[#F8FAFC] border border-steel-subtle">
            <ScoreRing
              score={fin.financial_score}
              maxScore={10}
              size="lg"
              label="Financial Score"
            />
          </div>
        </div>

        {/* Lead Institutional Investors */}
        {fin.lead_investors && fin.lead_investors.length > 0 && (
          <div className="pt-3 border-t border-steel-subtle space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-600" />
              <span>Lead Institutional Backers</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {fin.lead_investors.map((inv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-steel-subtle text-xs font-medium text-gray-800"
                >
                  {inv}
                </span>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* 4. Financial Strengths vs Financial Risks Comparative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Strengths */}
        <GlassCard className="space-y-4 border-cyan-200">
          <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Capital & Financial Strengths</span>
            </h4>
            <span className="text-[11px] font-mono text-cyan-700">
              {fin.financial_strengths?.length || 0} Points
            </span>
          </div>

          <KeyInsightsList
            items={fin.financial_strengths}
            variant="strength"
            emptyMessage="No financial strengths documented."
          />
        </GlassCard>

        {/* Financial Risks */}
        <GlassCard className="space-y-4 border-amber-200">
          <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Capital, Burn & Financial Risks</span>
            </h4>
            <span className="text-[11px] font-mono text-amber-700">
              {fin.financial_risks?.length || 0} Points
            </span>
          </div>

          <KeyInsightsList
            items={fin.financial_risks}
            variant="challenge"
            emptyMessage="No financial risks documented."
          />
        </GlassCard>
      </div>
    </div>
  );
};
