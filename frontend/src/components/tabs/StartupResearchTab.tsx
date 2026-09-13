import React from 'react';
import { JobResultsResponse } from '../../types/api';
import { GlassCard, SectionHeader, EmptyState } from '../common';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Users,
  Briefcase,
  Target,
  DollarSign,
  Award,
  Link2,
} from 'lucide-react';

export interface StartupResearchTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  onNavigateToSources?: () => void;
  className?: string;
}

export const StartupResearchTab: React.FC<StartupResearchTabProps> = ({
  results,
  targetCompany,
  onNavigateToSources,
  className = '',
}) => {
  const research = results?.full_context?.research_output;

  if (!research) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Startup Research Unavailable"
          description={
            targetCompany
              ? `Startup research has not yet completed for ${targetCompany}.`
              : 'Launch due diligence to view researched company intelligence.'
          }
        />
      </GlassCard>
    );
  }

  const funding = research.funding_info;

  return (
    <div
      role="tabpanel"
      id="panel-startup_research"
      aria-labelledby="tab-startup_research"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header with Metadata */}
      <SectionHeader
        title="Startup Intelligence & Company Profile"
        subtitle="Objective company profile, product architecture, and capitalization records gathered by the Startup Research Agent."
        icon={Building2}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Research Verified
          </span>
        }
        rightContent={
          research.sources && research.sources.length > 0 ? (
            <button
              type="button"
              onClick={onNavigateToSources}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-steel-subtle text-xs text-brand-600 hover:text-brand-700 font-medium transition shadow-sm"
              title="View all verified citations in the Research Sources tab"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{research.sources.length} Citations Available</span>
            </button>
          ) : undefined
        }
      />

      {/* 2. Core Corporate Identity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Industry */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-brand-600" />
            <span>Primary Industry</span>
          </div>
          <p className="text-base font-bold text-gray-900 tracking-tight">
            {research.industry || 'Not Publicly Available'}
          </p>
        </div>

        {/* Headquarters */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>Headquarters</span>
          </div>
          <p className="text-base font-bold text-gray-900 tracking-tight">
            {research.headquarters || 'Not Publicly Available'}
          </p>
        </div>

        {/* Founding Year */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-brand-600" />
            <span>Founding Year</span>
          </div>
          <p className="text-base font-bold font-mono text-gray-900 tracking-tight">
            {research.founding_year || 'Not Disclosed'}
          </p>
        </div>

        {/* Official Domain */}
        <div className="p-4 rounded-xl bg-white border border-steel-subtle shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
            <span>Official Website</span>
          </div>
          {research.official_website ? (
            <a
              href={research.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1.5 truncate tracking-tight"
            >
              <span className="truncate">
                {research.official_website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          ) : (
            <p className="text-base font-bold text-gray-400">Not Disclosed</p>
          )}
        </div>
      </div>

      {/* 3. Product & Market Proposition Surface */}
      <GlassCard className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 border-b border-steel-subtle pb-3">
          <Briefcase className="w-4 h-4 text-brand-600" />
          <span>Product Architecture & Value Proposition</span>
        </h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-700">Executive Product Overview</span>
            <p className="text-sm text-gray-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-steel-subtle">
              {research.product_service_summary || 'No product summary available from publicly verifiable research.'}
            </p>
          </div>

          {research.target_customers && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-600" />
                <span>Target Customer Segments</span>
              </span>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-steel-subtle text-xs text-gray-700 leading-relaxed">
                {research.target_customers}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* 4. Researched Founders List */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-steel-subtle pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" />
            <span>Identified Founding Team</span>
          </h4>
          <span className="text-[11px] font-mono text-gray-500">
            {research.founders?.length || 0} Identified
          </span>
        </div>

        {research.founders && research.founders.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {research.founders.map((founder, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-steel-subtle text-xs font-semibold text-gray-900 shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold text-[11px]">
                  {founder.charAt(0).toUpperCase()}
                </div>
                <span>{founder}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic p-3 rounded-lg bg-[#F8FAFC] border border-steel-subtle">
            No specific founder names extracted from open corporate registry. See Founder Evaluation for detailed investigation.
          </p>
        )}
      </GlassCard>

      {/* 5. Capitalization & Funding History */}
      <GlassCard className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 border-b border-steel-subtle pb-3">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Capitalization & Historical Rounds</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">
              Total Raised Capital
            </span>
            <span className="text-lg font-bold font-mono text-gray-900">
              {funding?.total_raised || 'Not Disclosed in Public Records'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">
              Latest Financing Round
            </span>
            <span className="text-base font-bold text-gray-800">
              {funding?.latest_round || 'Not Disclosed'}
            </span>
          </div>
        </div>

        {/* Lead Investors */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Lead Institutional Investors</span>
          </span>

          {funding?.lead_investors && funding.lead_investors.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {funding.lead_investors.map((investor, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-white border border-steel-subtle text-xs font-medium text-gray-800 shadow-sm"
                >
                  {investor}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic p-3 rounded-lg bg-[#F8FAFC] border border-steel-subtle">
              No lead investors publicly confirmed.
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
