import React, { useState, useMemo } from 'react';
import { JobResultsResponse } from '../../types/api';
import { GlassCard, SectionHeader, EmptyState } from '../common';
import {
  Link2,
  ExternalLink,
  Search,
  Globe2,
  FileCheck,
  HelpCircle,
} from 'lucide-react';

export interface ResearchSourcesTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const ResearchSourcesTab: React.FC<ResearchSourcesTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const sources = results?.full_context?.research_output?.sources || [];
  const [filterQuery, setFilterQuery] = useState('');

  // Extract hostname helper
  const getHostname = (url: string): string => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return url.split('/')[2] || 'external';
    }
  };

  // Derive unique domain count strictly from the URLs (Per Correction 5: No implied credibility score)
  const uniqueDomainsCount = useMemo(() => {
    const domains = new Set(sources.map((s) => getHostname(s)));
    return domains.size;
  }, [sources]);

  // Filter sources by query
  const filteredSources = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return sources;
    return sources.filter((s) => s.toLowerCase().includes(q));
  }, [sources, filterQuery]);

  if (!results?.full_context?.research_output) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Research Sources Unavailable"
          description={
            targetCompany
              ? `Research sources have not yet been logged for ${targetCompany}.`
              : 'Launch due diligence to view citation registry.'
          }
        />
      </GlassCard>
    );
  }

  return (
    <div
      role="tabpanel"
      id="panel-research_sources"
      aria-labelledby="tab-research_sources"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header */}
      <SectionHeader
        title="Research Citation Registry"
        subtitle="Complete directory of web sources, corporate registries, and public filings inspected during multi-agent due diligence."
        icon={Link2}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Source Citations
          </span>
        }
      />

      {/* 2. Source Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-steel-subtle flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              Total Sourced Citations
            </span>
            <span className="text-2xl font-extrabold font-mono text-gray-900 pt-1 block">
              {sources.length}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-600">
            <Link2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-steel-subtle flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
              Unique Research Domains
            </span>
            <span className="text-2xl font-extrabold font-mono text-cyan-600 pt-1 block">
              {uniqueDomainsCount}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600">
            <Globe2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filterable Citations Registry */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel-subtle pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Indexed Web References ({filteredSources.length} of {sources.length})
            </h4>
          </div>

          {/* Quick Search Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by domain or path..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D1D5DB] rounded-lg text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {filteredSources.length > 0 ? (
          <ul className="space-y-2.5">
            {filteredSources.map((url, idx) => {
              const domain = getHostname(url);
              return (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-steel-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-grow">
                    <span className="px-2 py-0.5 rounded bg-white border border-steel-subtle text-[11px] font-mono text-gray-700 shrink-0">
                      {domain}
                    </span>
                    <span className="text-xs font-mono text-gray-700 truncate" title={url}>
                      {url}
                    </span>
                  </div>

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-steel-subtle text-brand-600 hover:text-brand-700 text-xs font-semibold shrink-0 transition"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6 text-center text-xs text-gray-500 italic">
            No source URLs matched your filter criteria.
          </div>
        )}
      </GlassCard>

      {/* 4. Methodology Callout */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-steel-subtle text-xs text-gray-600">
        <HelpCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Source references represent the open web URLs, filings, and industry registries retrieved by the search provider during research queries. Unique domains are derived directly from the URLs without implied third-party credibility audits.
        </p>
      </div>
    </div>
  );
};
