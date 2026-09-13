import React from 'react';
import { JobResultsResponse } from '../../types/api';
import {
  GlassCard,
  ScoreRing,
  SectionHeader,
  RecommendationBadge,
  EmptyState,
} from '../common';
import {
  Gauge,
  Sparkles,
  HelpCircle,
  Users,
  LineChart,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export interface InvestmentAnalystTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const InvestmentAnalystTab: React.FC<InvestmentAnalystTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const memo = results?.memo;
  const context = results?.full_context;

  if (!memo || !context) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Investment Decision Cockpit Unavailable"
          description={
            targetCompany
              ? `Investment synthesis has not yet completed for ${targetCompany}.`
              : 'Launch due diligence to access the investment decision cockpit.'
          }
        />
      </GlassCard>
    );
  }

  const f = context.founder_output;
  const m = context.market_output;
  const fin = context.financial_output;
  const rk = context.risk_output;

  return (
    <div
      role="tabpanel"
      id="panel-investment_analyst"
      aria-labelledby="tab-investment_analyst"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header with Cockpit Identity */}
      <SectionHeader
        title="Investment Decision Cockpit"
        subtitle="High-signal synthesis answering the core institutional question: Should we invest?"
        icon={Gauge}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-600 border border-brand-200">
            Decision Engine Active
          </span>
        }
      />

      {/* 2. Top-Level Decision Banner */}
      <GlassCard className="space-y-6 border-brand-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Verdict Callout */}
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Primary Due Diligence Verdict
            </span>
            <div className="pt-1">
              <RecommendationBadge recommendation={memo.recommendation} size="lg" />
            </div>
            <p className="text-xs text-gray-500 max-w-md pt-1">
              Calculated from multi-agent synthesis across founder quality, addressable market, capital efficiency, and regulatory compliance.
            </p>
          </div>

          {/* Precision Gauges */}
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center shrink-0">
            <ScoreRing
              score={memo.overall_investment_score}
              maxScore={10}
              size="lg"
              label="Overall VC Score"
            />

            <div className="h-16 w-px bg-steel-subtle hidden sm:block" />

            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-steel-subtle bg-white flex flex-col items-center justify-center text-center p-2 shadow-sm">
                <span className="font-mono text-2xl font-extrabold text-brand-600 tracking-tight">
                  {memo.confidence_score}%
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                  Confidence
                </span>
              </div>
              <span className="mt-2 text-xs font-medium text-gray-700">
                Data Conviction
              </span>
              <span className="font-mono text-[10px] text-brand-600 font-semibold">
                {memo.confidence_score >= 80 ? 'High Confidence' : 'Moderate Conviction'}
              </span>
            </div>
          </div>
        </div>

        {/* Core Rationale & Thesis Narrative */}
        <div className="pt-4 border-t border-steel-subtle space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Investment Thesis & Decision Rationale</span>
          </span>
          <p className="text-sm text-gray-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-steel-subtle">
            {memo.reasoning}
          </p>
        </div>
      </GlassCard>

      {/* 3. Supporting Domain Scores (Explicitly Labeled as Backend-Provided) */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-brand-600" />
            <span>Supporting Domain Scores</span>
          </h4>
          <span className="text-[11px] font-mono text-gray-500">
            Backend-Provided Ratings (No Invented Weights)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-1 text-center">
            <span className="text-gray-500 block text-[11px] font-medium">Founder Score</span>
            <span className="text-lg font-bold font-mono text-gray-900">
              {f?.founder_score !== undefined ? `${f.founder_score.toFixed(1)}/10` : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-1 text-center">
            <span className="text-gray-500 block text-[11px] font-medium">Market Score</span>
            <span className="text-lg font-bold font-mono text-gray-900">
              {m?.market_score !== undefined ? `${m.market_score.toFixed(1)}/10` : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-1 text-center">
            <span className="text-gray-500 block text-[11px] font-medium">Financial Score</span>
            <span className="text-lg font-bold font-mono text-gray-900">
              {fin?.financial_score !== undefined ? `${fin.financial_score.toFixed(1)}/10` : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-1 text-center">
            <span className="text-gray-500 block text-[11px] font-medium">Risk Score (Inverted)</span>
            <span className="text-lg font-bold font-mono text-gray-900">
              {rk?.overall_risk_score !== undefined ? `${rk.overall_risk_score.toFixed(1)}/10` : 'N/A'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 4. Domain Synthesis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Founder Summary */}
        <GlassCard className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-brand-600" />
            <span>Founding Team Summary</span>
          </span>
          <p className="text-xs text-gray-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-steel-subtle">
            {memo.founder_summary}
          </p>
        </GlassCard>

        {/* Market Summary */}
        <GlassCard className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <LineChart className="w-3.5 h-3.5 text-cyan-600" />
            <span>Market Opportunity Summary</span>
          </span>
          <p className="text-xs text-gray-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-steel-subtle">
            {memo.market_summary}
          </p>
        </GlassCard>

        {/* Financial Summary */}
        <GlassCard className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Financial & Capitalization Summary</span>
          </span>
          <p className="text-xs text-gray-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-steel-subtle">
            {memo.financial_summary}
          </p>
        </GlassCard>

        {/* Risk Summary */}
        <GlassCard className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Risk & Regulatory Summary</span>
          </span>
          <p className="text-xs text-gray-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-steel-subtle">
            {memo.risk_summary}
          </p>
        </GlassCard>
      </div>

      {/* 5. Provenance Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle text-xs text-gray-600">
        <HelpCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The Investment Analyst cockpit presents the multi-agent decision engine's syntheses. No dynamic formulas or weighting percentages are invented; all numbers and texts are directly transmitted from the backend orchestrator.
        </p>
      </div>
    </div>
  );
};
