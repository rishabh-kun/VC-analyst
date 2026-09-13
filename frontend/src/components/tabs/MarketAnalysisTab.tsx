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
  LineChart,
  Globe2,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export interface MarketAnalysisTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const MarketAnalysisTab: React.FC<MarketAnalysisTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const market = results?.full_context?.market_output;

  if (!market) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Market Analysis Unavailable"
          description={
            targetCompany
              ? `Market analysis has not yet completed for ${targetCompany}.`
              : 'Launch due diligence to view market sizing and opportunity analysis.'
          }
        />
      </GlassCard>
    );
  }

  return (
    <div
      role="tabpanel"
      id="panel-market_analysis"
      aria-labelledby="tab-market_analysis"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header with Industry Classification */}
      <SectionHeader
        title="Market Sizing & Industry Dynamics"
        subtitle="Addressable market sizing, secular growth tailwinds, emerging trends, opportunities, and structural challenges."
        icon={LineChart}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Market Agent Verified
          </span>
        }
        rightContent={
          market.industry_market ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F8FAFC] border border-steel-subtle text-xs font-mono text-gray-700">
              <Globe2 className="w-3.5 h-3.5 text-brand-600" />
              <span>{market.industry_market}</span>
            </div>
          ) : undefined
        }
      />

      {/* 2. Top-Level TAM & Market Growth Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TAM */}
        <div className="p-5 rounded-xl bg-white border border-steel-subtle space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            <span>Total Addressable Market (TAM)</span>
          </span>
          <p className="text-xl sm:text-2xl font-extrabold font-mono text-gray-900 tracking-tight pt-1">
            {market.tam_estimate || 'Not Available from Research'}
          </p>
          <span className="text-[11px] text-gray-500 block">
            Synthesized industry sizing estimate
          </span>
        </div>

        {/* Market Growth Estimate */}
        <div className="p-5 rounded-xl bg-white border border-steel-subtle space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
            <span>Market Growth Estimate</span>
          </span>
          <p className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-600 tracking-tight pt-1">
            {market.market_growth_estimate || 'Not Available from Research'}
          </p>
          <span className="text-[11px] text-gray-500 block">
            Annualized expansion projection
          </span>
        </div>

        {/* Market Score */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle flex items-center justify-between sm:justify-center shadow-sm">
          <div className="space-y-1 sm:hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Market Opportunity
            </span>
            <p className="text-xs text-gray-500">Evaluated score / 10</p>
          </div>
          <ScoreRing
            score={market.market_score}
            maxScore={10}
            size="md"
            label="Market Score"
          />
        </div>
      </div>

      {/* 3. Market Opportunity Score Justification */}
      <GlassCard className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Market Thesis & Opportunity Assessment
        </span>
        <p className="text-sm text-gray-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-steel-subtle">
          {market.score_justification || 'No specific score justification provided by agent.'}
        </p>
      </GlassCard>

      {/* 4. Structured Market Trends */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span>Macro Industry Trends & Catalysts</span>
          </h4>
          <span className="text-[11px] font-mono text-gray-500">
            {market.market_trends?.length || 0} Trends Documented
          </span>
        </div>

        <KeyInsightsList
          items={market.market_trends}
          variant="neutral"
          emptyMessage="No specific market trends documented in public research."
        />
      </GlassCard>

      {/* 5. Opportunities vs Challenges Comparative Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Opportunities */}
        <GlassCard className="space-y-4 border-emerald-200">
          <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Strategic Market Opportunities</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-700">
              {market.market_opportunities?.length || 0} Identified
            </span>
          </div>

          <KeyInsightsList
            items={market.market_opportunities}
            variant="opportunity"
            emptyMessage="No market opportunities documented."
          />
        </GlassCard>

        {/* Structural Challenges */}
        <GlassCard className="space-y-4 border-amber-200">
          <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Structural Market Challenges</span>
            </h4>
            <span className="text-[11px] font-mono text-amber-700">
              {market.market_challenges?.length || 0} Documented
            </span>
          </div>

          <KeyInsightsList
            items={market.market_challenges}
            variant="challenge"
            emptyMessage="No market challenges documented."
          />
        </GlassCard>
      </div>
    </div>
  );
};
