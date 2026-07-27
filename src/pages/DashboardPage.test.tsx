import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { server } from '@/test/server'
import { DashboardPage } from './DashboardPage'

const mockAdminStats = {
  gemini: { todayTokens: 100, monthTokens: 3000, estimatedMonthlyCostUsd: 0.07 },
  pageViews: [{ date: '2026-07-27', count: 5 }],
}

afterEach(() => localStorage.clear())

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
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)))
    render(<DashboardPage />, { wrapper })
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3))
  })

  it('opens modal when card is clicked', async () => {
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)))
    render(<DashboardPage />, { wrapper })
    await waitFor(() => screen.getAllByRole('article'))
    await userEvent.click(screen.getAllByRole('article')[0])
    await waitFor(() => expect(screen.getByText('채점 이유')).toBeInTheDocument())
  })

  it('shows loading skeletons initially', () => {
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)))
    render(<DashboardPage />, { wrapper })
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows error state with retry button when API fails', async () => {
    server.use(
      http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)),
      http.get('/api/ideas', () =>
        HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
      ),
    )
    render(<DashboardPage />, { wrapper })
    await waitFor(() =>
      expect(screen.getByText('데이터를 불러올 수 없습니다.')).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
  })

  it('shows empty state message when no ideas returned', async () => {
    server.use(
      http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)),
      http.get('/api/ideas', () =>
        HttpResponse.json({
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 20,
        }),
      ),
    )
    render(<DashboardPage />, { wrapper })
    await waitFor(() =>
      expect(screen.getByText('아직 아이디어가 없습니다.')).toBeInTheDocument(),
    )
  })

  it('shows all status tab labels', async () => {
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)))
    render(<DashboardPage />, { wrapper })
    expect(screen.getByRole('tab', { name: '전체' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '알림 완료' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '채점 완료' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '대기 중' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '거절됨' })).toBeInTheDocument()
  })

  it('shows pipeline trigger button for ADMIN role', async () => {
    localStorage.setItem('daybrew_role', 'ADMIN')
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)))
    render(<DashboardPage />, { wrapper })
    expect(screen.getByRole('button', { name: '파이프라인 실행' })).toBeInTheDocument()
  })

  it('hides pipeline trigger button for non-admin role', async () => {
    server.use(http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)))
    render(<DashboardPage />, { wrapper })
    expect(screen.queryByRole('button', { name: '파이프라인 실행' })).not.toBeInTheDocument()
  })

  it('shows success state after pipeline trigger', async () => {
    localStorage.setItem('daybrew_role', 'ADMIN')
    server.use(
      http.get('/api/admin/stats', () => HttpResponse.json(mockAdminStats)),
      http.post('/api/admin/pipeline/trigger', () =>
        HttpResponse.json({ message: 'Pipeline triggered' }),
      ),
    )
    render(<DashboardPage />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: '파이프라인 실행' }))
    await waitFor(() =>
      expect(screen.getByText('파이프라인 시작됨')).toBeInTheDocument(),
    )
  })
})
