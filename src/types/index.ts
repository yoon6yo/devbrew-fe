export type IdeaStatus = 'PENDING' | 'SCORED' | 'NOTIFIED' | 'REJECTED'
export type SourceTrack = 'SAAS' | 'GITHUB' | 'VIRAL'

export interface IdeaDto {
  id: number
  title: string
  description: string
  sourceTrack: SourceTrack
  sourceUrl: string
  score: number | null
  scoreReason: string | null
  status: IdeaStatus
  createdAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
