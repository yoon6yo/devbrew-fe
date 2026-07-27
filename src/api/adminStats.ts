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
