// TODO: These types will be fully defined in Task 2 (API layer)

export type SourceTrack = 'SAAS' | 'GITHUB' | 'VIRAL'
export type IdeaStatus = 'PENDING' | 'SCORED' | 'NOTIFIED'

export interface IdeaDto {
  id: number
  title: string
  description: string
  sourceTrack: SourceTrack
  sourceUrl: string
  score: number
  scoreReason: string
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
