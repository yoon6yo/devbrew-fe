import { describe, it, expect } from 'vitest'
import { getIdeas, getIdea, rejectIdea, getTopIdeas, getIdeaStats } from './ideas'

describe('getIdeas', () => {
  it('fetches paginated ideas with score desc sort', async () => {
    const result = await getIdeas({ page: 0, size: 20 })
    expect(result.content).toHaveLength(3)
    expect(result.totalElements).toBe(3)
  })
})

describe('getIdea', () => {
  it('fetches a single idea by id', async () => {
    const idea = await getIdea(1)
    expect(idea.id).toBe(1)
    expect(idea.title).toBe('AI 기반 코드 리뷰 SaaS')
  })
})

describe('rejectIdea', () => {
  it('POSTs to reject endpoint and returns updated dto', async () => {
    const idea = await rejectIdea(1)
    expect(idea.status).toBe('REJECTED')
  })
})

describe('getTopIdeas', () => {
  it('returns array of ideas', async () => {
    const ideas = await getTopIdeas(5)
    expect(Array.isArray(ideas)).toBe(true)
  })
})

describe('getIdeaStats', () => {
  it('returns per-status counts from /api/ideas/stats', async () => {
    // mockIdeas: id:1=SCORED, id:2=PENDING, id:3=NOTIFIED
    const stats = await getIdeaStats()
    expect(stats.SCORED).toBe(1)
    expect(stats.PENDING).toBe(1)
    expect(stats.NOTIFIED).toBe(1)
    expect(stats.REJECTED).toBe(0)
  })
})
