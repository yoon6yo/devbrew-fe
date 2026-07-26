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
