import React from 'react';
import { Building2, MapPin, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { RecommendationBadge } from '../components/common/RecommendationBadge';
import { VCRecommendation } from '../types/agents';

export interface CompanyQuickBarProps {
  companyName?: string | null;
  industry?: string | null;
  headquarters?: string | null;
  foundingYear?: number | string | null;
  overallScore?: number | null;
  recommendation?: VCRecommendation | null;
  website?: string | null;
  isAnalyzing?: boolean;
}

export const CompanyQuickBar: React.FC<CompanyQuickBarProps> = ({
  companyName,
  industry,
  headquarters,
  foundingYear,
  overallScore,
  recommendation,
  website,
  isAnalyzing = false,
}) => {
  // Empty / No Active Diligence state
  if (!companyName) {
    return (
      <div className="border-b border-steel-subtle bg-white py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
            <span>No active due diligence target selected.</span>
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-gray-400">
            Awaiting Target Input
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-steel-subtle bg-white py-3 px-4 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Identity metadata */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600 shrink-0" />
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
              {companyName}
            </h2>
          </div>

          {industry && (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-steel-subtle text-[11px] font-medium text-gray-700">
              {industry}
            </span>
          )}

          <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500 font-medium">
            {headquarters && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span>{headquarters}</span>
              </span>
            )}
            {foundingYear && (
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                <span>Est. {foundingYear}</span>
              </span>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-brand-600 hover:text-brand-700 hover:underline"
              >
                <span>Website</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Right: Scores & Recommendation Badges */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          {isAnalyzing ? (
            <span className="text-xs text-brand-600 font-medium animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping"></span>
              Synthesizing Diligence Data...
            </span>
          ) : (
            <>
              {overallScore !== undefined && overallScore !== null && (
                <ScoreBadge score={overallScore} label="Overall VC Score" size="sm" />
              )}
              {recommendation && (
                <RecommendationBadge recommendation={recommendation} size="sm" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
