/**
 * API contracts matching api.py endpoints:
 * - POST /api/analyze
 * - GET  /api/status/{job_id}
 * - GET  /api/results/{job_id}
 * - GET  /api/health
 */

import { InvestmentMemoOutput } from './agents';
import { VCPipelineContext } from './context';

// ----------------------------------------------------
// Enums & Keys
// ----------------------------------------------------

export type AgentStepKey =
  | 'startup_research'
  | 'founder_evaluation'
  | 'market_analysis'
  | 'financial_analysis'
  | 'risk_assessment'
  | 'investment_memo';

export type StepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ERROR';

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'ERROR';

export interface StepProgressItem {
  name: string;
  status: StepStatus;
  summary: string;
}

// ----------------------------------------------------
// Request & Response Payloads
// ----------------------------------------------------

export interface AnalyzeRequest {
  startup_name: string;
}

export interface AnalyzeResponse {
  job_id: string;
  startup_name: string;
  status: JobStatus;
  message: string;
}

export interface JobStatusResponse {
  job_id: string;
  startup_name: string;
  status: JobStatus;
  current_step: string;
  steps_progress: Record<AgentStepKey, StepProgressItem>;
  error?: string | null;
}

export interface JobResultsResponse {
  job_id: string;
  status: 'COMPLETED' | 'ERROR' | 'RUNNING' | 'QUEUED';
  startup_name: string;
  /**
   * Final VC Investment Memo output.
   * Null if analysis is still in progress or failed.
   */
  memo: InvestmentMemoOutput | null;
  /**
   * Full context dump containing all 6 intermediate agent outputs.
   * Null if analysis is still in progress or failed.
   */
  full_context: VCPipelineContext | null;
  message?: string;
  error?: string | null;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

// ----------------------------------------------------
// Error Contract
// ----------------------------------------------------

export interface ApiError {
  message: string;
  statusCode?: number;
  detail?: string;
}
