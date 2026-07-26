import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { DashboardPage } from './DashboardPage'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('DashboardPage', () => {
  it('renders idea cards after loading', async () => {
    render(<DashboardPage />, { wrapper })
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3))
  })
  it('opens modal when card is clicked', async () => {
    render(<DashboardPage />, { wrapper })
    await waitFor(() => screen.getAllByRole('article'))
    await userEvent.click(screen.getAllByRole('article')[0])
    await waitFor(() => expect(screen.getByText('채점 이유')).toBeInTheDocument())
  })
})
