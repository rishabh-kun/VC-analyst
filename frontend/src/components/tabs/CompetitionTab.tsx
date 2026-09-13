import React from 'react';
import { JobResultsResponse } from '../../types/api';
import { GlassCard, SectionHeader, EmptyState } from '../common';
import { Swords, ShieldCheck, HelpCircle } from 'lucide-react';

export interface CompetitionTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const CompetitionTab: React.FC<CompetitionTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const competitors = results?.full_context?.market_output?.major_competitors || [];

  if (!results?.full_context?.market_output) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Competitive Landscape Unavailable"
          description={
            targetCompany
              ? `Competitive landscape mapping has not yet completed for ${targetCompany}.`
              : 'Launch due diligence to view competitor intelligence.'
          }
        />
      </GlassCard>
    );
  }

  return (
    <div
      role="tabpanel"
      id="panel-competition"
      aria-labelledby="tab-competition"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header with Provenance Notice */}
      <SectionHeader
        title="Competitive Landscape & Moat Analysis"
        subtitle="Direct competitors mapped and evaluated by the Market Analysis Agent, highlighting unique differentiation and defensibility."
        icon={Swords}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Market Intelligence Sourced
          </span>
        }
        rightContent={
          <div className="flex items-center gap-2 text-xs text-gray-600 font-mono bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-steel-subtle">
            <span className="text-gray-500">Identified Competitors:</span>
            <span className="text-gray-900 font-bold">{competitors.length}</span>
          </div>
        }
      />

      {/* 2. Institutional Table View (Desktop & Tablet) */}
      <GlassCard className="overflow-hidden p-0">
        <div className="p-4 border-b border-steel-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Competitor Comparison Matrix
            </h4>
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            Derived from Market Analysis Agent
          </span>
        </div>

        {competitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-steel-subtle bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-[#4B5563]">
                  <th scope="col" className="py-3.5 px-4 w-1/4">
                    Competitor
                  </th>
                  <th scope="col" className="py-3.5 px-4 w-5/12">
                    Profile & Positioning
                  </th>
                  <th scope="col" className="py-3.5 px-4 w-1/3">
                    Target Company's Key Differentiator / Moat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-subtle text-xs bg-white">
                {competitors.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    {/* Competitor Name */}
                    <td className="py-4 px-4 font-bold text-cyan-700 align-top">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-600 shrink-0" />
                        <span className="text-sm">{c.name}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-4 text-gray-700 leading-relaxed align-top">
                      {c.description || (
                        <span className="text-gray-500 italic">No detailed profile recorded.</span>
                      )}
                    </td>

                    {/* Key Differentiator */}
                    <td className="py-4 px-4 align-top">
                      {c.key_differentiator ? (
                        <div className="p-2.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-800 text-xs leading-relaxed flex items-start gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                          <span>{c.key_differentiator}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No specific moat documented.</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500 italic">
            No specific competitors documented in the market intelligence profile.
          </div>
        )}
      </GlassCard>

      {/* 3. Methodology Transparency Callout */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle text-xs text-gray-600">
        <HelpCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-gray-900 block">
            Competitive Perspective Sourcing
          </span>
          <p className="leading-relaxed">
            Competition is synthesized as a core dimension of the Market Analysis Agent.
            All competitor evaluations reflect publicly verified market alternatives, value propositions, and defensive moats without fabricated market share or revenue approximations.
          </p>
        </div>
      </div>
    </div>
  );
};
