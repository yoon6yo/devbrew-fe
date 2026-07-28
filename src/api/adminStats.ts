import { apiFetch } from './client'

export interface GeminiStatsDto {
  todayTokens: number
  monthTokens: number
  estimatedMonthlyCostUsd: number
}

export interface DailyViewsDto {
  date: string
  count: number
}

export interface AdminStatsDto {
  gemini: GeminiStatsDto
  pageViews: DailyViewsDto[]
}

export function getAdminStats(): Promise<AdminStatsDto> {
  return apiFetch<AdminStatsDto>('/api/admin/stats')
}

export type SourceTrack = 'SAAS' | 'GITHUB' | 'VIRAL'

export interface PipelineTriggerOptions {
  sources?: SourceTrack[]
}

export function triggerPipeline(options?: PipelineTriggerOptions): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/admin/pipeline/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: options ? JSON.stringify(options) : undefined,
  })
}

export interface PipelineStatus {
  running: boolean
  step: string | null
  stepIndex: number
  totalSteps: number
  detail: string | null
  startedAt: string | null
  finishedAt: string | null
  result: string | null
  error: string | null
  lastCollectAt: string | null
  lastCollectResult: string | null
  nextCollectAt: string
  lastScoreAt: string | null
  lastScoreResult: string | null
  nextScoreAt: string
}

export function getPipelineStatus(): Promise<PipelineStatus> {
  return apiFetch<PipelineStatus>('/api/admin/pipeline/status')
}

export function triggerCollect(options?: PipelineTriggerOptions): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/admin/pipeline/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: options ? JSON.stringify(options) : undefined,
  })
}

export function triggerScore(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/admin/pipeline/score', { method: 'POST' })
}
