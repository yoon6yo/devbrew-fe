import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { useIdeaDetail } from './useIdeaDetail'

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useIdeaDetail', () => {
  it('fetches idea when id is provided', async () => {
    const { result } = renderHook(() => useIdeaDetail(1), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe(1)
    expect(result.current.data?.title).toBe('AI 기반 코드 리뷰 SaaS')
  })

  it('stays idle and does not fetch when id is null', () => {
    const { result } = renderHook(() => useIdeaDetail(null), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })

  it('transitions to error state when idea id does not exist', async () => {
    const { result } = renderHook(() => useIdeaDetail(99999), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
