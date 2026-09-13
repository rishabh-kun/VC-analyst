import React from 'react';
import { JobResultsResponse } from '../../types/api';
import { GlassCard, ScoreRing, SectionHeader, RiskBadge, EmptyState } from '../common';
import {
  ShieldAlert,
  Users,
  LineChart,
  DollarSign,
  Settings,
  Scale,
  Info,
} from 'lucide-react';

export interface RiskAnalysisTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const RiskAnalysisTab: React.FC<RiskAnalysisTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const risk = results?.full_context?.risk_output;

  if (!risk) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Risk Assessment Unavailable"
          description={
            targetCompany
              ? `Risk assessment has not yet completed for ${targetCompany}.`
              : 'Launch due diligence to view multi-vector risk synthesis.'
          }
        />
      </GlassCard>
    );
  }

  // 5 Canonical Risk Vectors
  const riskVectors = [
    { label: 'Founder Risk', level: risk.founder_risk, icon: Users },
    { label: 'Market Risk', level: risk.market_risk, icon: LineChart },
    { label: 'Financial Risk', level: risk.financial_risk, icon: DollarSign },
    { label: 'Operational Risk', level: risk.operational_risk, icon: Settings },
    { label: 'Legal & Regulatory Risk', level: risk.legal_regulatory_risk, icon: Scale },
  ];

  return (
    <div
      role="tabpanel"
      id="panel-risk_analysis"
      aria-labelledby="tab-risk_analysis"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header with Semantic Inverted Risk Indicator */}
      <SectionHeader
        title="Multi-Vector Risk Assessment"
        subtitle="Evaluation across five risk dimensions. Sourced directly from the Risk Assessment Agent."
        icon={ShieldAlert}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Risk Agent Verified
          </span>
        }
      />

      {/* 2. Master Overall Risk Score Card */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Composite Risk Synthesis
              </span>
              <RiskBadge score={risk.overall_risk_score} size="sm" />
            </div>

            <p className="text-sm text-gray-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-steel-subtle">
              {risk.risk_summary || 'No composite risk narrative provided by agent.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-3.5 h-3.5 text-gray-500" />
              <span>
                Scale semantics: 0.0–3.9 Low (Emerald), 4.0–6.9 Medium (Amber), 7.0–10.0 High (Crimson). Higher score represents higher risk.
              </span>
            </div>
          </div>

          <div className="shrink-0 p-3 rounded-xl bg-[#F8FAFC] border border-steel-subtle">
            <ScoreRing
              score={risk.overall_risk_score}
              maxScore={10}
              size="lg"
              label="Overall Risk Score"
              isRisk={true}
            />
          </div>
        </div>
      </GlassCard>

      {/* 3. Five-Vector Risk Matrix (Per Correction 2: No startup-specific impact descriptions) */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-600" />
            <span>Five-Vector Risk Heatmap</span>
          </h4>
          <span className="text-[11px] font-mono text-gray-500">
            5 Core Institutional Dimensions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {riskVectors.map((vec, idx) => {
            const Icon = vec.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <RiskBadge level={vec.level} size="sm" showIcon={false} />
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-900 block tracking-tight">
                    {vec.label}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">
                    Category: {vec.level || 'Not Evaluated'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
