import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { useIdeaStats } from './useIdeaStats'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('useIdeaStats', () => {
  it('returns per-status counts from API', async () => {
    const { result } = renderHook(() => useIdeaStats(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // mockIdeas: SCORED=1, PENDING=1, NOTIFIED=1, REJECTED=0
    expect(result.current.data?.SCORED).toBe(1)
    expect(result.current.data?.PENDING).toBe(1)
    expect(result.current.data?.NOTIFIED).toBe(1)
    expect(result.current.data?.REJECTED).toBe(0)
  })
})
