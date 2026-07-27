import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { server } from '@/test/server'
import { useIdeas } from './useIdeas'

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }
}

describe('useIdeas', () => {
  it('returns paginated idea list', async () => {
    const { result } = renderHook(() => useIdeas({}), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content).toHaveLength(3)
  })

  it('sends status query param when filter is provided', async () => {
    let capturedStatus: string | null = null
    server.use(
      http.get('/api/ideas', ({ request }) => {
        capturedStatus = new URL(request.url).searchParams.get('status')
        return HttpResponse.json({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 })
      })
    )
    const { result } = renderHook(() => useIdeas({ status: 'NOTIFIED' }), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(capturedStatus).toBe('NOTIFIED')
  })

  it('transitions to error state when API returns 500', async () => {
    server.use(http.get('/api/ideas', () => HttpResponse.json({}, { status: 500 })))
    const { result } = renderHook(() => useIdeas({}), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
