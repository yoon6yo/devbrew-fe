import { apiFetch } from './client'
import type { IdeaDto, IdeaStatus, PageResponse } from '@/types'

interface GetIdeasParams {
  status?: IdeaStatus
  statuses?: IdeaStatus[]
  today?: boolean
  page?: number
  size?: number
}

export function getIdeas({ status, statuses, today, page = 0, size = 20 }: GetIdeasParams = {}): Promise<PageResponse<IdeaDto>> {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort: 'score,desc' })
  if (statuses && statuses.length > 0) {
    statuses.forEach(s => params.append('statuses', s))
  } else if (status) {
    params.set('status', status)
  }
  if (today !== undefined) params.set('today', String(today))
  return apiFetch(`/api/ideas?${params}`)
}

export function getIdea(id: number): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}`)
}

export function rejectIdea(id: number): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}/reject`, { method: 'POST' })
}

export async function getTopIdeas(n = 5): Promise<IdeaDto[]> {
  const page = await getIdeas({ page: 0, size: n })
  return page.content
}

export interface IdeaStatsDto {
  PENDING: number
  SCORED: number
  NOTIFIED: number
  REJECTED: number
}

export function getIdeaStats(): Promise<IdeaStatsDto> {
  return apiFetch<IdeaStatsDto>('/api/ideas/stats')
}
