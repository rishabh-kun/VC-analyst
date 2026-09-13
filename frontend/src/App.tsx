import React, { useState } from 'react';
import { AppLayout } from './layouts';
import { TabKey } from './types/navigation';
import { AgentStepKey, StepStatus, StepProgressItem } from './types/api';
import { StartupSearchForm } from './components/search';
import {
  OverviewTab,
  StartupResearchTab,
  FounderEvaluationTab,
  MarketAnalysisTab,
  CompetitionTab,
  FinancialAnalysisTab,
  RiskAnalysisTab,
  InvestmentAnalystTab,
  InvestmentMemoTab,
  ResearchSourcesTab,
} from './components/tabs';
import {
  GlassCard,
  MetricTile,
  ScoreBadge,
  RiskBadge,
  RecommendationBadge,
} from './components/common';
import { PipelineProgressBar, AgentStepCard } from './components/pipeline';
import { useVCPipeline, formatCurrentStep } from './state/useVCPipeline';
import {
  Sparkles,
  Search,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Activity,
} from 'lucide-react';

/**
 * Canonical 6-agent execution pipeline definition.
 * Used for deterministic ordering and fallback labels across the live orchestrator.
 */
interface CanonicalAgentDefinition {
  key: AgentStepKey;
  number: number;
  name: string;
  defaultSummary: string;
}

const CANONICAL_AGENTS: CanonicalAgentDefinition[] = [
  {
    key: 'startup_research',
    number: 1,
    name: 'Startup Research Agent',
    defaultSummary: 'Investigates company domain, product architecture, founders, and funding rounds.',
  },
  {
    key: 'founder_evaluation',
    number: 2,
    name: 'Founder Evaluation Agent',
    defaultSummary: 'Assesses founder domain expertise, serial pedigree, and team execution score.',
  },
  {
    key: 'market_analysis',
    number: 3,
    name: 'Market Analysis Agent',
    defaultSummary: 'Calculates Total Addressable Market (TAM), market growth estimates, and competitor landscape.',
  },
  {
    key: 'financial_analysis',
    number: 4,
    name: 'Financial Analysis Agent',
    defaultSummary: 'Analyzes capital structure, revenue generation model, and financial health score.',
  },
  {
    key: 'risk_assessment',
    number: 5,
    name: 'Risk Assessment Agent',
    defaultSummary: 'Computes inverted 0-10 risk profile across founder, market, and regulatory vectors.',
  },
  {
    key: 'investment_memo',
    number: 6,
    name: 'Investment Memo Agent',
    defaultSummary: 'Synthesizes all autonomous intelligence into the formal Investment Committee memo.',
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const {
    lifecycle,
    startupName,
    stepsProgress,
    currentStep,
    results,
    error,
    progressPercent,
    completedStepsCount,
    startAnalysis,
    cancel,
    reset,
  } = useVCPipeline();

  const isAnalyzing =
    lifecycle === 'STARTING' || lifecycle === 'QUEUED' || lifecycle === 'RUNNING';

  const handleStartAnalysis = (targetName: string) => {
    setActiveTab('overview');
    startAnalysis(targetName);
  };

  const handleReset = () => {
    reset();
    setActiveTab('overview');
  };

  // Derive current company info for header QuickBar from real backend state
  const currentCompanyInfo = results
    ? {
        companyName:
          results.full_context?.research_output?.company_name ||
          results.startup_name ||
          startupName,
        industry: results.full_context?.research_output?.industry,
        headquarters: results.full_context?.research_output?.headquarters,
        foundingYear: results.full_context?.research_output?.founding_year,
        overallScore: results.memo?.overall_investment_score,
        recommendation: results.memo?.recommendation,
        website: results.full_context?.research_output?.official_website,
      }
    : startupName && isAnalyzing
    ? {
        companyName: startupName,
        isAnalyzing: true,
      }
    : undefined;

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      companyInfo={currentCompanyInfo}
      onNewAnalysisClick={lifecycle !== 'IDLE' ? handleReset : undefined}
      isAnalyzing={isAnalyzing}
      showNavigation={lifecycle === 'COMPLETED'}
    >
      {/* ========================================================================= */}
      {/* 1. IDLE STATE: HOME SEARCH & VALUE PROPOSITION                            */}
      {/* ========================================================================= */}
      {lifecycle === 'IDLE' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Institutional Hero Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Autonomous Venture Capital Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Institutional Due Diligence at Venture Scale
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Enter any startup name below. Six specialized autonomous AI agents will
              perform deep web research, evaluate founders, calculate TAM, stress-test financials,
              synthesize risks, and author a venture-grade Investment Committee memorandum.
            </p>
          </div>

          {/* Diligence Search Card */}
          <GlassCard className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-steel-subtle pb-3">
              <Search className="w-4 h-4 text-brand-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Initiate Venture Due Diligence
              </h2>
            </div>

            <StartupSearchForm
              onSubmit={handleStartAnalysis}
              isLoading={isAnalyzing}
            />
          </GlassCard>

          {/* 6-Agent Autonomous Architecture Grid */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-steel-subtle pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-600" />
                <span>6 Specialized Autonomous Agents In Pipeline</span>
              </h3>
              <span className="text-[11px] font-mono text-gray-500">
                FastAPI Orchestrator Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CANONICAL_AGENTS.map((agent) => (
                <div
                  key={agent.key}
                  className="p-4 rounded-xl border border-steel-subtle bg-white shadow-sm space-y-2 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-[#F8FAFC] border border-steel-subtle text-gray-700 font-mono text-xs flex items-center justify-center font-bold">
                      {agent.number}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                      Autonomous
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 tracking-tight">{agent.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{agent.defaultSummary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VC Cockpit Architectural Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <MetricTile
              label="Domain Score System"
              value="10.0 Scale"
              subValue="Founders, Market, Financials"
              icon={Activity}
              badge={<ScoreBadge score={8.8} size="sm" />}
            />
            <MetricTile
              label="Risk Semantics"
              value="Inverted"
              subValue="Higher score = Higher risk"
              icon={ShieldCheck}
              badge={<RiskBadge score={3.2} size="sm" />}
            />
            <MetricTile
              label="Verdict Engine"
              value="4 Tiers"
              subValue="Strong Invest, Invest, Watch, Pass"
              icon={Sparkles}
              badge={<RecommendationBadge recommendation="Strong Invest" size="sm" />}
            />
            <MetricTile
              label="Analytical Scope"
              value="10 Tabs"
              subValue="Deep-dive perspective dashboards"
              icon={Layers}
              badge={
                <span className="text-[11px] font-mono text-brand-600 font-semibold">
                  Modular Shell
                </span>
              }
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE ORCHESTRATOR PROGRESS VIEW (STARTING / QUEUED / RUNNING)          */}
      {/* ========================================================================= */}
      {isAnalyzing && (
        <div className="space-y-6 animate-fadeIn">
          {/* Accessible Live Region */}
          <div
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            Due diligence in progress for {startupName}. Current stage: {formatCurrentStep(currentStep)}. Overall pipeline progress: {progressPercent}%.
          </div>

          {/* Master Progress Control Card */}
          <GlassCard className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel-subtle pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-ping"></span>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Autonomous Due Diligence in Progress
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Target Company:</span>
                  <span className="font-bold text-gray-900 font-mono">{startupName}</span>
                  <span className="text-gray-300">&bull;</span>
                  <span className="text-brand-600 font-mono">
                    {formatCurrentStep(currentStep)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold animate-pulse">
                  {lifecycle === 'STARTING' && 'Initializing...'}
                  {lifecycle === 'QUEUED' && 'Queued in Engine'}
                  {lifecycle === 'RUNNING' && 'Agents Executing'}
                </span>

                <button
                  type="button"
                  onClick={cancel}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-steel-subtle bg-white hover:bg-gray-50 text-xs text-gray-600 hover:text-gray-900 transition shadow-sm"
                  title="Cancel current analysis run"
                >
                  <XCircle className="w-3.5 h-3.5 text-gray-400" />
                  <span>Abort</span>
                </button>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <PipelineProgressBar
              progressPercent={progressPercent}
              completedCount={completedStepsCount}
              totalCount={6}
              currentStepName={formatCurrentStep(currentStep)}
            />
          </GlassCard>

          {/* Six Autonomous Agent Live Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
              <span className="uppercase tracking-wider font-semibold text-gray-600">
                Autonomous Agents Execution Status
              </span>
              <span className="font-mono text-[11px] text-gray-400">
                Polling interval: ~1500ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CANONICAL_AGENTS.map((agent) => {
                const liveStep: StepProgressItem = stepsProgress?.[agent.key] || {
                  name: agent.name,
                  status: 'PENDING' as StepStatus,
                  summary: agent.defaultSummary,
                };

                return (
                  <AgentStepCard
                    key={agent.key}
                    stepKey={agent.key}
                    stepNumber={agent.number}
                    step={liveStep}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ERROR STATE VIEW                                                       */}
      {/* ========================================================================= */}
      {lifecycle === 'ERROR' && (
        <div className="space-y-6 animate-fadeIn">
          <GlassCard className="border-red-200 bg-red-50/70 space-y-4">
            <div className="flex items-start gap-3" role="alert">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-grow">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  Due Diligence Execution Error
                </h3>
                <p className="text-sm text-red-700">
                  {error || 'An unexpected error occurred during pipeline execution.'}
                </p>
                {startupName && (
                  <p className="text-xs text-gray-600 font-mono pt-1">
                    Target Company: {startupName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-steel-subtle">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Start New Diligence</span>
              </button>

              {startupName && (
                <button
                  type="button"
                  onClick={() => handleStartAnalysis(startupName)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 border border-steel-subtle text-gray-700 hover:text-gray-900 rounded-xl text-xs font-medium transition shadow-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
                  <span>Retry {startupName}</span>
                </button>
              )}
            </div>
          </GlassCard>

          {/* Show partial steps progress if available */}
          {stepsProgress && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Agent Status at Time of Failure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CANONICAL_AGENTS.map((agent) => (
                  <AgentStepCard
                    key={agent.key}
                    stepKey={agent.key}
                    stepNumber={agent.number}
                    step={
                      stepsProgress[agent.key] || {
                        name: agent.name,
                        status: 'PENDING' as StepStatus,
                        summary: agent.defaultSummary,
                      }
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COMPLETED RESULTS VIEW (UNLOCKED 10-TAB SUITE)                         */}
      {/* ========================================================================= */}
      {lifecycle === 'COMPLETED' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Completion Status & New Diligence Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-steel-subtle shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                    Due Diligence Completed for {results?.startup_name || startupName}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                    6 of 6 Verified
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Select any of the 10 domain tabs above to review detailed intelligence.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-steel-subtle bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-medium transition shadow-sm flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-brand-600" />
                <span>Analyze Another Startup</span>
              </button>
            </div>
          </div>

          {/* Active Tab View (Rendering Dedicated Phase 5 Dashboards) */}
          {activeTab === 'overview' && (
            <OverviewTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'startup_research' && (
            <StartupResearchTab
              results={results}
              targetCompany={results?.startup_name || startupName}
              onNavigateToSources={() => setActiveTab('research_sources')}
            />
          )}

          {activeTab === 'founder_evaluation' && (
            <FounderEvaluationTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'market_analysis' && (
            <MarketAnalysisTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'competition' && (
            <CompetitionTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'financial_analysis' && (
            <FinancialAnalysisTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'risk_analysis' && (
            <RiskAnalysisTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'investment_analyst' && (
            <InvestmentAnalystTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'investment_memo' && (
            <InvestmentMemoTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}

          {activeTab === 'research_sources' && (
            <ResearchSourcesTab
              results={results}
              targetCompany={results?.startup_name || startupName}
            />
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default App;
