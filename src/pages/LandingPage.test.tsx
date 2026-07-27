import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { server } from '../test/server'
import LandingPage from './LandingPage'

describe('LandingPage', () => {
  it('renders brand name and hero headline', () => {
    render(<LandingPage />)
    expect(screen.getAllByText('daybrew')[0]).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /만들 만한/ })).toBeInTheDocument()
  })

  it('renders all three how-it-works steps', () => {
    render(<LandingPage />)
    expect(screen.getByText('신호 수집')).toBeInTheDocument()
    expect(screen.getByText('AI 분석 · 채점')).toBeInTheDocument()
    expect(screen.getByText('기획서 전달')).toBeInTheDocument()
  })

  it('shows loading skeleton initially', () => {
    render(<LandingPage />)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders idea cards after fetching from API', async () => {
    render(<LandingPage />)
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3))
  })

  it('shows footer links to privacy and terms pages', () => {
    render(<LandingPage />)
    expect(screen.getByRole('link', { name: '개인정보처리방침' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '이용약관' })).toBeInTheDocument()
  })

  it('shows error state and retry button when API fails, then recovers', async () => {
    server.use(http.get('/api/ideas', () => HttpResponse.error()))
    render(<LandingPage />)

    await waitFor(() => expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument())

    server.resetHandlers()
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }))

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3))
  })
})
