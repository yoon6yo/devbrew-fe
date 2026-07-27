import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { getAdminStats, triggerPipeline } from './adminStats'

const mockStats = {
  gemini: { todayTokens: 120, monthTokens: 5000, estimatedMonthlyCostUsd: 0.12 },
  pageViews: [{ date: '2026-07-27', count: 42 }],
}

describe('getAdminStats', () => {
  it('fetches gemini usage and page view stats', async () => {
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockStats)))
    const stats = await getAdminStats()
    expect(stats.gemini.todayTokens).toBe(120)
    expect(stats.gemini.monthTokens).toBe(5000)
    expect(stats.gemini.estimatedMonthlyCostUsd).toBe(0.12)
    expect(stats.pageViews).toHaveLength(1)
    expect(stats.pageViews[0].count).toBe(42)
  })
})

describe('triggerPipeline', () => {
  it('POSTs to pipeline trigger and returns message', async () => {
    server.use(
      http.post('/api/admin/pipeline/trigger', () =>
        HttpResponse.json({ message: 'Pipeline triggered' }),
      ),
    )
    const result = await triggerPipeline()
    expect(result.message).toBe('Pipeline triggered')
  })
})
