import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { SummaryCards } from './SummaryCards'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('SummaryCards', () => {
  it('shows loading skeleton while fetching', () => {
    render(<SummaryCards />, { wrapper })
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders all four status labels after loading', async () => {
    render(<SummaryCards />, { wrapper })
    await waitFor(() => expect(screen.getByText('알림 완료')).toBeInTheDocument())
    expect(screen.getByText('채점 완료')).toBeInTheDocument()
    expect(screen.getByText('대기 중')).toBeInTheDocument()
    expect(screen.getByText('거절됨')).toBeInTheDocument()
  })

  it('renders counts from /api/ideas/stats', async () => {
    // mockIdeas: SCORED=1, PENDING=1, NOTIFIED=1, REJECTED=0
    render(<SummaryCards />, { wrapper })
    await waitFor(() => expect(screen.getAllByText('1')).toHaveLength(3))
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
