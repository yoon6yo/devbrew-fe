import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { useRejectIdea } from './useRejectIdea'
import { mockPage } from '@/test/fixtures'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  qc.setQueryData(['ideas', { status: undefined, page: 0 }], mockPage)
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('useRejectIdea', () => {
  it('calls mutate without throwing', async () => {
    const { result } = renderHook(() => useRejectIdea(), { wrapper })
    act(() => { result.current.mutate(1) })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
