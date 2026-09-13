/**
 * Custom React hook managing the multi-agent VC analysis pipeline lifecycle.
 *
 * Lifecycle:
 * IDLE -> STARTING -> QUEUED -> RUNNING -> COMPLETED (or ERROR)
 *
 * Implements resilient 1500ms polling, AbortController cancellation,
 * interval leak prevention, and typed results retrieval.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AgentStepKey,
  StepProgressItem,
  JobResultsResponse,
  JobStatusResponse,
} from '../types/api';
import { analyzeStartup, getJobStatus, getJobResults } from '../api/vcApi';
import { ApiClientError } from '../api/client';

export type PipelineLifecycle =
  | 'IDLE'
  | 'STARTING'
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'ERROR';

export interface VCPipelineState {
  lifecycle: PipelineLifecycle;
  jobId: string | null;
  startupName: string | null;
  stepsProgress: Record<AgentStepKey, StepProgressItem> | null;
  currentStep: string;
  results: JobResultsResponse | null;
  error: string | null;
  progressPercent: number;
  completedStepsCount: number;
}

export interface UseVCPipelineReturn extends VCPipelineState {
  startAnalysis: (startupName: string) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export const POLLING_INTERVAL_MS = 1500;
export const TOTAL_AGENT_STEPS = 6;

/**
 * Pure helper formatting current_step value for display.
 */
export function formatCurrentStep(step: string | undefined): string {
  if (!step || step === 'INIT') return 'Preparing analysis...';
  switch (step.toUpperCase()) {
    case 'RESEARCH':
    case 'STARTUP_RESEARCH':
      return 'Stage 1: Startup Research Agent';
    case 'FOUNDER':
    case 'FOUNDER_EVALUATION':
      return 'Stage 2: Founder Evaluation Agent';
    case 'MARKET':
    case 'MARKET_ANALYSIS':
      return 'Stage 3: Market Analysis Agent';
    case 'FINANCIAL':
    case 'FINANCIAL_ANALYSIS':
      return 'Stage 4: Financial Analysis Agent';
    case 'RISK':
    case 'RISK_ASSESSMENT':
      return 'Stage 5: Risk Assessment Agent';
    case 'MEMO':
    case 'INVESTMENT_MEMO':
      return 'Stage 6: Investment Memo Agent';
    case 'COMPLETED':
      return 'Diligence Complete';
    default:
      return step;
  }
}

/**
 * Pure helper calculating progress percentage (0-100) based on completed steps.
 */
export function calculateProgressPercent(
  stepsProgress: Record<AgentStepKey, StepProgressItem> | null
): number {
  if (!stepsProgress) return 0;
  const completed = Object.values(stepsProgress).filter(
    (step) => step.status === 'COMPLETED'
  ).length;
  return Math.min(100, Math.round((completed / TOTAL_AGENT_STEPS) * 100));
}

/**
 * Pure helper returning count of completed agent steps.
 */
export function getCompletedStepsCount(
  stepsProgress: Record<AgentStepKey, StepProgressItem> | null
): number {
  if (!stepsProgress) return 0;
  return Object.values(stepsProgress).filter((s) => s.status === 'COMPLETED').length;
}

export function useVCPipeline(): UseVCPipelineReturn {
  const [lifecycle, setLifecycle] = useState<PipelineLifecycle>('IDLE');
  const [jobId, setJobId] = useState<string | null>(null);
  const [startupName, setStartupName] = useState<string | null>(null);
  const [stepsProgress, setStepsProgress] = useState<Record<AgentStepKey, StepProgressItem> | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('INIT');
  const [results, setResults] = useState<JobResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // References for cleanup and polling lifecycle
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const clearTimer = useCallback(() => {
    if (pollingTimerRef.current !== null) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  const abortPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    abortPendingRequests();
    setLifecycle('IDLE');
    setJobId(null);
    setStartupName(null);
    setStepsProgress(null);
    setCurrentStep('INIT');
    setResults(null);
    setError(null);
  }, [clearTimer, abortPendingRequests]);

  const cancel = useCallback(() => {
    clearTimer();
    abortPendingRequests();
    setLifecycle('IDLE');
  }, [clearTimer, abortPendingRequests]);

  // Clean up timer and in-flight requests on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      abortPendingRequests();
    };
  }, [clearTimer, abortPendingRequests]);

  // Internal polling worker
  const pollStatus = useCallback(
    async (activeJobId: string, signal: AbortSignal) => {
      try {
        const statusData: JobStatusResponse = await getJobStatus(activeJobId, signal);

        // Update progress state
        setStepsProgress(statusData.steps_progress);
        setCurrentStep(statusData.current_step);

        if (statusData.status === 'RUNNING') {
          setLifecycle('RUNNING');
        } else if (statusData.status === 'COMPLETED') {
          clearTimer();

          // Fetch full results
          try {
            const resultsData = await getJobResults(activeJobId, signal);
            if (resultsData.status === 'ERROR') {
              setError(resultsData.error || 'Workflow reported an error.');
              setLifecycle('ERROR');
            } else {
              setResults(resultsData);
              setLifecycle('COMPLETED');
            }
          } catch (resErr) {
            if (signal.aborted) return;
            const message =
              resErr instanceof ApiClientError
                ? resErr.message
                : 'Failed to retrieve analysis results.';
            setError(message);
            setLifecycle('ERROR');
          }
        } else if (statusData.status === 'ERROR') {
          clearTimer();
          const errorMsg =
            statusData.error || 'Workflow execution halted due to an agent error.';
          setError(errorMsg);
          setLifecycle('ERROR');
        }
      } catch (err) {
        if (signal.aborted) return;
        // Don't halt on single transient network glitch during intermediate polling
        console.warn('Transient polling error:', err);
      }
    },
    [clearTimer]
  );

  const startAnalysis = useCallback(
    async (targetStartup: string) => {
      const trimmed = targetStartup.trim();
      if (!trimmed) {
        setError('Startup name cannot be empty.');
        setLifecycle('ERROR');
        return;
      }

      // Clear previous timer and controller
      clearTimer();
      abortPendingRequests();

      setJobId(null);
      setResults(null);
      setError(null);
      setStepsProgress(null);
      setCurrentStep('INIT');
      setStartupName(trimmed);
      setLifecycle('STARTING');

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await analyzeStartup(trimmed, controller.signal);
        const newJobId = response.job_id;

        setJobId(newJobId);
        setLifecycle('QUEUED');

        // Start polling loop
        isPollingRef.current = true;
        pollingTimerRef.current = setInterval(() => {
          if (isPollingRef.current && abortControllerRef.current) {
            pollStatus(newJobId, abortControllerRef.current.signal);
          }
        }, POLLING_INTERVAL_MS);

        // Immediate first poll
        pollStatus(newJobId, controller.signal);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof ApiClientError
            ? err.message
            : err instanceof Error
            ? err.message
            : 'Failed to initialize startup analysis.';
        setError(message);
        setLifecycle('ERROR');
      }
    },
    [clearTimer, abortPendingRequests, pollStatus]
  );

  const progressPercent = calculateProgressPercent(stepsProgress);
  const completedStepsCount = getCompletedStepsCount(stepsProgress);

  return {
    lifecycle,
    jobId,
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
  };
}
