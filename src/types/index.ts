export type IdeaStatus = 'PENDING' | 'SCORING' | 'SCORED' | 'NOTIFIED' | 'FEATURED' | 'REJECTED'
export type SourceTrack = 'SAAS' | 'GITHUB' | 'VIRAL' | 'HACKERNEWS'

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
  oneLiner: string | null
  problems: string | null
  revenueModel: string | null
  strengths: string | null
  risks: string | null
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
