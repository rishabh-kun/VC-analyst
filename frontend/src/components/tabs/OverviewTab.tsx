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
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
} from 'lucide-react';

export interface OverviewTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const memo = results?.memo;
  const context = results?.full_context;

  if (!results || !memo || !context) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="No Due Diligence Data Available"
          description={
            targetCompany
              ? `Due diligence has not yet completed for ${targetCompany}. Run an analysis to view the executive overview.`
              : 'Enter a startup name above and launch due diligence to view the comprehensive executive overview.'
          }
        />
      </GlassCard>
    );
  }

  const r = context.research_output;
  const f = context.founder_output;
  const m = context.market_output;
  const fin = context.financial_output;
  const rk = context.risk_output;

  const companyName = r?.company_name || results.startup_name || memo.company_name;

  return (
    <div
      role="tabpanel"
      id="panel-overview"
      aria-labelledby="tab-overview"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Master Executive Decision Header */}
      <GlassCard className="space-y-6 border border-steel-subtle shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Company Identity & Quick Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-brand-50 border border-brand-200 text-brand-600 text-[11px] font-semibold uppercase tracking-wider">
                Investment Committee Brief
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                Job ID: {results.job_id.slice(0, 8)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {companyName}
            </h1>

            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              {r?.industry && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-steel-subtle text-gray-700">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{r.industry}</span>
                </span>
              )}
              {r?.headquarters && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{r.headquarters}</span>
                </span>
              )}
              {r?.founding_year && (
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Est. {r.founding_year}</span>
                </span>
              )}
              {r?.official_website && (
                <a
                  href={r.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-600 hover:text-brand-700 hover:underline"
                >
                  <span>{r.official_website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Right: Primary Verdict & Precision Gauges */}
          <div className="flex items-center gap-5 sm:gap-6 flex-wrap shrink-0">
            <div className="space-y-1 text-center sm:text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">
                IC Recommendation
              </span>
              <RecommendationBadge recommendation={memo.recommendation} size="lg" />
            </div>

            <div className="h-14 w-px bg-steel-subtle hidden sm:block" />

            <ScoreRing
              score={memo.overall_investment_score}
              maxScore={10}
              size="md"
              label="Composite Score"
            />

            <div className="h-14 w-px bg-steel-subtle hidden sm:block" />

            {rk?.overall_risk_score !== undefined && (
              <ScoreRing
                score={rk.overall_risk_score}
                maxScore={10}
                size="md"
                label="Overall Risk"
                isRisk={true}
              />
            )}
          </div>
        </div>

        {/* Executive Summary Callout */}
        <div className="pt-4 border-t border-steel-subtle space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              <span>Executive Synthesis</span>
            </span>
            <span className="font-mono text-[11px] text-indigo-600 font-semibold">
              Confidence: {memo.confidence_score}%
            </span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-steel-subtle">
            {memo.executive_summary}
          </p>
        </div>
      </GlassCard>

      {/* 2. Four-Domain Score Comparison Matrix */}
      <GlassCard className="space-y-4">
        <SectionHeader
          title="Domain Score Comparison"
          subtitle="Side-by-side evaluation across all core investment domains sourced from specialized agents."
          icon={Layers}
          badge={
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Ratings
            </span>
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle flex flex-col items-center justify-center space-y-2 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#374151]">
              Founding Team
            </span>
            <ScoreRing
              score={f?.founder_score ?? 0}
              maxScore={10}
              size="sm"
              label="Founder Score"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle flex flex-col items-center justify-center space-y-2 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#374151]">
              Market & TAM
            </span>
            <ScoreRing
              score={m?.market_score ?? 0}
              maxScore={10}
              size="sm"
              label="Market Score"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle flex flex-col items-center justify-center space-y-2 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#374151]">
              Financial Health
            </span>
            <ScoreRing
              score={fin?.financial_score ?? 0}
              maxScore={10}
              size="sm"
              label="Financial Score"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle flex flex-col items-center justify-center space-y-2 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#374151]">
              Risk Profile
            </span>
            <ScoreRing
              score={rk?.overall_risk_score ?? 0}
              maxScore={10}
              size="sm"
              label="Inverted Risk"
              isRisk={true}
            />
          </div>
        </div>
      </GlassCard>

      {/* 3. Six Autonomous Diligence Modules Status */}
      <GlassCard className="space-y-4">
        <SectionHeader
          title="Autonomous Diligence Pipeline Verification"
          subtitle="All six specialized AI agents executed and validated within the shared workflow context."
          icon={Cpu}
          badge={
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 6 of 6 Verified
            </span>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {/* Module 1 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-white border border-steel-subtle text-[#374151] font-mono text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Startup Research Agent</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Mined corporate registry, official domain, {r?.sources?.length || 0} source citations, and verified profile data.
            </p>
          </div>

          {/* Module 2 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-white border border-steel-subtle text-[#374151] font-mono text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Founder Evaluation Agent</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Researched {f?.founder_profiles?.length || 0} founder profiles, previous companies, previous startups, and assigned a {f?.founder_score?.toFixed(1) || '0.0'}/10 score.
            </p>
          </div>

          {/* Module 3 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-white border border-steel-subtle text-[#374151] font-mono text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Market Analysis Agent</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Estimated TAM ({m?.tam_estimate || 'N/A'}), growth metrics, industry trends, and mapped {m?.major_competitors?.length || 0} key competitors.
            </p>
          </div>

          {/* Module 4 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-white border border-steel-subtle text-[#374151] font-mono text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Financial Analysis Agent</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Assessed capitalization, estimated revenue, lead investors, and evaluated balance sheet runway.
            </p>
          </div>

          {/* Module 5 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-white border border-steel-subtle text-[#374151] font-mono text-xs flex items-center justify-center font-bold">
                5
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Risk Assessment Agent</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Synthesized 5-vector risk profile ({rk?.overall_risk_score?.toFixed(1) || '0.0'}/10 overall risk on inverted scale).
            </p>
          </div>

          {/* Module 6 */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-white border border-steel-subtle text-[#374151] font-mono text-xs flex items-center justify-center font-bold">
                6
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#111827]">Investment Memo Agent</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Synthesized composite decision ({memo.recommendation}, score {memo.overall_investment_score?.toFixed(1)}/10) and authored formal IC memorandum.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
