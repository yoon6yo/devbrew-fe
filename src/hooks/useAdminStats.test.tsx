import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { server } from '@/test/server'
import { useAdminStats } from './useAdminStats'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

const mockStats = {
  gemini: { todayTokens: 80, monthTokens: 3200, estimatedMonthlyCostUsd: 0.08 },
  pageViews: [
    { date: '2026-07-26', count: 10 },
    { date: '2026-07-27', count: 25 },
  ],
}

describe('useAdminStats', () => {
  it('fetches and returns admin stats', async () => {
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockStats)))
    const { result } = renderHook(() => useAdminStats(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.gemini.todayTokens).toBe(80)
    expect(result.current.data?.pageViews).toHaveLength(2)
  })

  it('exposes error state on API failure', async () => {
    server.use(
      http.get('/api/admin/stats', () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    )
    const { result } = renderHook(() => useAdminStats(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
