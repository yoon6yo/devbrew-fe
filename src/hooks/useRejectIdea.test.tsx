import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { useRejectIdea } from './useRejectIdea'
import { mockPage } from '@/test/fixtures'

function makeWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useRejectIdea', () => {
  it('calls mutate without throwing', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    qc.setQueryData(['ideas', { status: undefined, page: 0 }], mockPage)
    const { result } = renderHook(() => useRejectIdea(), { wrapper: makeWrapper(qc) })
    act(() => { result.current.mutate(1) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('invalidates both ideas and ideaStats queries on settled', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    qc.setQueryData(['ideas', { status: undefined, page: 0 }], mockPage)
    const invalidate = vi.spyOn(qc, 'invalidateQueries')

    const { result } = renderHook(() => useRejectIdea(), { wrapper: makeWrapper(qc) })
    act(() => { result.current.mutate(1) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['ideas'] })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['idea'] })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['ideaStats'] })
  })
})
