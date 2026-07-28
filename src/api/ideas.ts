import { apiFetch } from './client'
import type { IdeaDto, IdeaStatus, PageResponse } from '@/types'

interface GetIdeasParams {
  status?: IdeaStatus
  statuses?: IdeaStatus[]
  today?: boolean
  page?: number
  size?: number
  sort?: string
}

export function getIdeas({ status, statuses, today, page = 0, size = 20, sort = 'score,desc' }: GetIdeasParams = {}): Promise<PageResponse<IdeaDto>> {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort })
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

export function restoreIdea(id: number): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}/restore`, { method: 'POST' })
}

export function scoreIdea(id: number): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}/score`, { method: 'POST' })
}

export function notifyIdea(id: number): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}/notify`, { method: 'POST' })
}

export function featureIdea(id: number): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}/feature`, { method: 'POST' })
}

export async function getTopIdeas(n = 5): Promise<IdeaDto[]> {
  const page = await getIdeas({ page: 0, size: n })
  return page.content
}

export interface IdeaStatsDto {
  PENDING: number
  SCORING?: number
  SCORED: number
  NOTIFIED: number
  FEATURED: number
  REJECTED: number
}

export function getIdeaStats(): Promise<IdeaStatsDto> {
  return apiFetch<IdeaStatsDto>('/api/ideas/stats')
}

export function starIdea(id: number, fingerprint: string): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}/star`, {
    method: 'POST',
    headers: { 'X-Fingerprint': fingerprint },
  })
}

export function unstarIdea(id: number, fingerprint: string): Promise<IdeaDto> {
  return apiFetch(`/api/ideas/${id}/star`, {
    method: 'DELETE',
    headers: { 'X-Fingerprint': fingerprint },
  })
}
