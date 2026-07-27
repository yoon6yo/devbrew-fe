import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { server } from '@/test/server'
import { IdeaModal } from './IdeaModal'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('IdeaModal', () => {
  it('renders nothing when ideaId is null', () => {
    const { container } = render(<IdeaModal ideaId={null} onClose={() => {}} />, { wrapper })
    expect(container.firstChild).toBeNull()
  })
  it('renders idea title when open', async () => {
    render(<IdeaModal ideaId={1} onClose={() => {}} />, { wrapper })
    await waitFor(() => expect(screen.getByText('AI 기반 코드 리뷰 SaaS')).toBeInTheDocument())
  })
  it('calls onClose on close button click', async () => {
    const onClose = vi.fn()
    render(<IdeaModal ideaId={1} onClose={onClose} />, { wrapper })
    await waitFor(() => screen.getByText('AI 기반 코드 리뷰 SaaS'))
    await userEvent.click(screen.getByRole('button', { name: /닫기/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('locks body scroll when open and restores it on close', async () => {
    const { rerender } = render(<IdeaModal ideaId={1} onClose={() => {}} />, { wrapper })
    await waitFor(() => screen.getByText('AI 기반 코드 리뷰 SaaS'))
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<IdeaModal ideaId={null} onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('')
  })

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn()
    render(<IdeaModal ideaId={1} onClose={onClose} />, { wrapper })
    await waitFor(() => screen.getByText('AI 기반 코드 리뷰 SaaS'))
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows error alert when reject mutation fails', async () => {
    server.use(
      http.post('/api/ideas/:id/reject', () =>
        HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
      ),
    )
    render(<IdeaModal ideaId={1} onClose={() => {}} />, { wrapper })
    await waitFor(() => screen.getByText('AI 기반 코드 리뷰 SaaS'))
    await userEvent.click(screen.getByRole('button', { name: '거절' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('거절 처리에 실패했습니다.'),
    )
  })
})
