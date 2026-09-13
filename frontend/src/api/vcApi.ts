/**
 * Typed VC Analyst API service.
 * Consumes existing FastAPI backend endpoints without modifying any contracts.
 */

import { request } from './client';
import {
  AnalyzeRequest,
  AnalyzeResponse,
  JobStatusResponse,
  JobResultsResponse,
  HealthResponse,
} from '../types/api';

/**
 * Triggers the 6-agent VC due diligence pipeline for a target startup.
 * POST /api/analyze
 */
export async function analyzeStartup(
  startupName: string,
  signal?: AbortSignal
): Promise<AnalyzeResponse> {
  const payload: AnalyzeRequest = {
    startup_name: startupName.trim(),
  };

  return request<AnalyzeResponse>('/api/analyze', {
    method: 'POST',
    body: payload,
    signal,
  });
}

/**
 * Retrieves the current execution progress and agent steps status for a running job.
 * GET /api/status/{job_id}
 */
export async function getJobStatus(
  jobId: string,
  signal?: AbortSignal
): Promise<JobStatusResponse> {
  const encodedId = encodeURIComponent(jobId);
  return request<JobStatusResponse>(`/api/status/${encodedId}`, {
    method: 'GET',
    signal,
  });
}

/**
 * Retrieves the final VC Investment Memorandum and complete pipeline context.
 * GET /api/results/{job_id}
 */
export async function getJobResults(
  jobId: string,
  signal?: AbortSignal
): Promise<JobResultsResponse> {
  const encodedId = encodeURIComponent(jobId);
  return request<JobResultsResponse>(`/api/results/${encodedId}`, {
    method: 'GET',
    signal,
  });
}

/**
 * Checks the operational status of the FastAPI backend.
 * GET /api/health
 */
export async function checkHealth(
  signal?: AbortSignal
): Promise<HealthResponse> {
  return request<HealthResponse>('/api/health', {
    method: 'GET',
    signal,
  });
}
