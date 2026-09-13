import React from 'react';
import { JobResultsResponse } from '../../types/api';
import { GlassCard, ScoreRing, SectionHeader, EmptyState } from '../common';
import {
  Users,
  GraduationCap,
  Building,
  Rocket,
  Award,
  BookOpen,
} from 'lucide-react';

export interface FounderEvaluationTabProps {
  results?: JobResultsResponse | null;
  targetCompany?: string | null;
  className?: string;
}

export const FounderEvaluationTab: React.FC<FounderEvaluationTabProps> = ({
  results,
  targetCompany,
  className = '',
}) => {
  const founderData = results?.full_context?.founder_output;

  if (!founderData) {
    return (
      <GlassCard className={className}>
        <EmptyState
          variant="no-analysis"
          title="Founder Evaluation Unavailable"
          description={
            targetCompany
              ? `Founder evaluation has not yet completed for ${targetCompany}.`
              : 'Launch due diligence to view founder background and execution analysis.'
          }
        />
      </GlassCard>
    );
  }

  const profiles = founderData.founder_profiles || [];

  return (
    <div
      role="tabpanel"
      id="panel-founder_evaluation"
      aria-labelledby="tab-founder_evaluation"
      tabIndex={0}
      className={`space-y-6 w-full focus:outline-none ${className}`}
    >
      {/* 1. Header & Founder Score Summary */}
      <SectionHeader
        title="Founding Team Evaluation"
        subtitle="Objective background diligence, pedigree, educational background, previous companies and previous startups."
        icon={Users}
        badge={
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Founder Audit Verified
          </span>
        }
      />

      {/* 2. Score & Justification Callout */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-grow">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Founder Execution Evaluation
            </span>
            <p className="text-sm text-gray-800 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-steel-subtle">
              {founderData.score_justification || 'No score justification provided by agent.'}
            </p>
            <span className="text-xs text-gray-500 font-mono block">
              Diligence mapped {profiles.length} key founder/executive profile(s).
            </span>
          </div>

          <div className="shrink-0 p-3 rounded-xl bg-[#F8FAFC] border border-steel-subtle">
            <ScoreRing
              score={founderData.founder_score}
              maxScore={10}
              size="lg"
              label="Founder Score"
            />
          </div>
        </div>
      </GlassCard>

      {/* 3. Detailed Researched Founder Profiles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span className="font-semibold uppercase tracking-wider text-gray-500">
            Researched Founder Profiles ({profiles.length})
          </span>
          <span className="text-[11px] font-mono text-gray-500">
            Sourced via public verified records
          </span>
        </div>

        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {profiles.map((profile, idx) => (
              <GlassCard key={idx} className="space-y-4 border-steel-subtle hover:border-steel-prominent transition-colors">
                {/* Profile Header */}
                <div className="flex items-center gap-3 border-b border-steel-subtle pb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold text-base">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 tracking-tight">{profile.name}</h4>
                    <span className="text-xs text-brand-600 font-medium">Founder / Executive</span>
                  </div>
                </div>

                {/* Relevant Experience Narrative */}
                {profile.relevant_experience && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-brand-600" />
                      <span>Relevant Experience</span>
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-steel-subtle">
                      {profile.relevant_experience}
                    </p>
                  </div>
                )}

                {/* Education */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Education</span>
                  </span>
                  {profile.education && profile.education.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.education.map((edu, eIdx) => (
                        <span
                          key={eIdx}
                          className="px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-steel-subtle text-xs text-gray-700"
                        >
                          {edu}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No higher education institutions publicly documented.</p>
                  )}
                </div>

                {/* Previous Companies & Startups */}
                <div className="space-y-2 pt-1 border-t border-steel-subtle">
                  {/* Previous Companies */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <Building className="w-3 h-3 text-amber-600" />
                      <span>Previous Companies</span>
                    </span>
                    {profile.previous_companies && profile.previous_companies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.previous_companies.map((comp, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-steel-subtle text-xs text-gray-700 font-mono"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">None publicly listed.</p>
                    )}
                  </div>

                  {/* Previous Startups */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <Rocket className="w-3 h-3 text-brand-600" />
                      <span>Previous Startups</span>
                    </span>
                    {profile.previous_startups && profile.previous_startups.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.previous_startups.map((sup, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-brand-50 border border-brand-200 text-xs text-brand-700 font-mono font-medium"
                          >
                            {sup}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No prior ventures publicly documented.</p>
                    )}
                  </div>
                </div>

                {/* Public Achievements */}
                {profile.public_achievements && profile.public_achievements.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-steel-subtle">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600" />
                      <span>Public Achievements</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                      {profile.public_achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="leading-relaxed">
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard>
            <p className="text-xs text-gray-500 italic text-center py-6">
              No individual founder bios extracted. Overall team score assigned from verified corporate leadership records.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
