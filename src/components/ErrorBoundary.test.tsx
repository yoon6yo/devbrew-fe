import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

function Thrower() {
  throw new Error('test error')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <p>normal content</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('normal content')).toBeInTheDocument()
  })

  it('renders error fallback when child throws', () => {
    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    )
    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '새로고침' })).toBeInTheDocument()
  })

  it('reload button calls window.location.reload', async () => {
    const reload = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, reload })

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    )
    await userEvent.click(screen.getByRole('button', { name: '새로고침' }))
    expect(reload).toHaveBeenCalledOnce()
  })
})
