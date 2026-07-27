export type IdeaStatus = 'PENDING' | 'SCORED' | 'NOTIFIED' | 'REJECTED'
export type SourceTrack = 'SAAS' | 'GITHUB' | 'VIRAL'

export interface IdeaDto {
  id: number
  title: string
  description: string
  sourceTrack: SourceTrack
  sourceUrl: string | null
  score: number | null
  scoreMarketFit: number | null
  scoreNovelty: number | null
  scoreFeasibility: number | null
  scoreMonetization: number | null
  scoreTrend: number | null
  scoreReason: string | null
  starCount: number
  status: IdeaStatus
  createdAt: string
  purpose: string | null
  howItWorks: string | null
  suggestedStack: string | null
  implementationGuide: string | null
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
