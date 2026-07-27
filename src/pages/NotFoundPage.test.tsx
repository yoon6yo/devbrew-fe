import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import React from 'react'
import NotFoundPage from './NotFoundPage'

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('NotFoundPage', () => {
  it('renders 404 heading and message', () => {
    render(<NotFoundPage />, { wrapper })
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없습니다' })).toBeInTheDocument()
  })

  it('renders home link', () => {
    render(<NotFoundPage />, { wrapper })
    const link = screen.getByRole('link', { name: '홈으로 돌아가기' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
