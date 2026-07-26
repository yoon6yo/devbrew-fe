import type { IdeaDto, PageResponse } from '@/types'

export const mockIdea: IdeaDto = {
  id: 1,
  title: 'AI 기반 코드 리뷰 SaaS',
  description: '개발자를 위한 AI 코드 리뷰 플랫폼.',
  sourceTrack: 'SAAS',
  sourceUrl: 'https://example.com',
  score: 8,
  scoreMarketFit: 9,
  scoreNovelty: 7,
  scoreFeasibility: 8,
  scoreMonetization: 8,
  scoreTrend: 7,
  scoreReason: 'PMF 명확, 시장 규모 큼',
  starCount: 0,
  status: 'SCORED',
  createdAt: '2026-07-26T09:00:00+09:00',
  purpose: null,
  howItWorks: null,
  suggestedStack: null,
}

export const mockIdeas: IdeaDto[] = [
  mockIdea,
  { ...mockIdea, id: 2, title: 'GitHub 트렌드 분석 툴', sourceTrack: 'GITHUB', score: 6, status: 'PENDING' },
  { ...mockIdea, id: 3, title: '바이럴 마케팅 자동화', sourceTrack: 'VIRAL', score: 9, status: 'NOTIFIED' },
]

export const mockPage: PageResponse<IdeaDto> = {
  content: mockIdeas,
  totalElements: 3,
  totalPages: 1,
  number: 0,
  size: 20,
}
