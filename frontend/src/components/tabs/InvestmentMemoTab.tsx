import React from 'react';
import { JobResultsResponse } from '../../types/api';
import {
  GlassCard,
  SectionHeader,
  ScoreBadge,
  RecommendationBadge,
  EmptyState,
} from '../common';
import {
  FileText,
  Printer,
  FileCheck,
} from 'lucide-react';

export interface InvestmentMemoTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const InvestmentMemoTab: React.FC<InvestmentMemoTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const memo = results?.memo;

  if (!memo) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Investment Memorandum Unavailable"
          description={
            targetCompany
              ? `Investment memorandum has not yet been authored for ${targetCompany}.`
              : 'Launch due diligence to generate the formal Investment Committee memorandum.'
          }
        />
      </GlassCard>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { title: '1. Executive Summary', content: memo.executive_summary },
    { title: '2. Startup & Core Product Profile', content: memo.startup_summary },
    { title: '3. Founder & Leadership Team Assessment', content: memo.founder_summary },
    { title: '4. Market Opportunity & Industry Dynamics', content: memo.market_summary },
    { title: '5. Financial Health & Capitalization', content: memo.financial_summary },
    { title: '6. Risk Synthesis & Regulatory Exposure', content: memo.risk_summary },
    { title: '7. Investment Thesis & Decision Rationale', content: memo.reasoning },
  ];

  return (
    <div
      role="tabpanel"
      id="panel-investment_memo"
      aria-labelledby="tab-investment_memo"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* Action Header */}
      <SectionHeader
        title="Formal Investment Committee Memorandum"
        subtitle="Confidential internal deal memorandum synthesized for partner review, deal screening, and investment committee voting."
        icon={FileText}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            IC Ready
          </span>
        }
        rightContent={
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-steel-subtle text-xs font-semibold text-gray-700 hover:text-gray-900 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-brand-600" />
            <span>Print / PDF Export</span>
          </button>
        }
      />

      {/* Formal IC Memorandum Document Shell */}
      <div className="bg-white border border-steel-subtle rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm relative font-sans print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Deal Header */}
        <div className="border-b border-steel-subtle pb-6 space-y-4 print:border-gray-300">
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono print:text-gray-600">
            <span className="uppercase tracking-widest font-bold text-brand-600 print:text-gray-800">
              CONFIDENTIAL &bull; FOR PARTNER REVIEW ONLY
            </span>
            <span>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight print:text-black">
                {memo.company_name}
              </h1>
              <span className="text-xs text-gray-500 block font-medium print:text-gray-600">
                Institutional Due Diligence Memorandum
              </span>
            </div>

            <div className="flex items-center gap-3">
              <RecommendationBadge recommendation={memo.recommendation} size="md" />
              <ScoreBadge score={memo.overall_investment_score} size="md" label="VC Score" />
              <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-steel-subtle text-xs font-mono font-bold text-brand-600 print:bg-gray-100 print:text-gray-800">
                Confidence: {memo.confidence_score}%
              </span>
            </div>
          </div>
        </div>

        {/* 7 Narrative Memorandum Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-800 print:text-gray-900">
          {sections.map((sec, idx) => (
            <section key={idx} className="space-y-2.5 print:break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 border-b border-steel-subtle pb-1.5 print:text-gray-800 print:border-gray-300">
                {sec.title}
              </h2>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle text-xs sm:text-sm text-gray-800 leading-relaxed print:bg-transparent print:p-0 print:border-none print:text-gray-800">
                {sec.content || (
                  <span className="text-gray-500 italic">No section details synthesized.</span>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Formal Signature & Verification Footer */}
        <div className="pt-8 border-t border-steel-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500 print:border-gray-300 print:text-gray-600">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Autonomous Diligence Verified by Multi-Agent VC Analyst</span>
          </div>
          <div className="font-mono text-[11px]">
            Final Recommendation: <strong className="text-gray-900 print:text-black">{memo.recommendation}</strong> ({memo.overall_investment_score.toFixed(1)}/10)
          </div>
        </div>
      </div>
    </div>
  );
};
