import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { server } from '@/test/server'
import OAuthCallbackPage from './OAuthCallbackPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router-dom')>()
  return { ...mod, useNavigate: () => mockNavigate }
})

afterEach(() => {
  mockNavigate.mockReset()
  localStorage.clear()
})

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('OAuthCallbackPage', () => {
  it('navigates to /dashboard for ADMIN user', async () => {
    server.use(
      http.get('/api/auth/me', () =>
        HttpResponse.json({ email: 'admin@test.com', role: 'ADMIN' }),
      ),
    )
    render(<OAuthCallbackPage />, { wrapper })
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true }))
    expect(localStorage.getItem('daybrew_role')).toBe('ADMIN')
  })

  it('navigates to / for non-admin user', async () => {
    server.use(
      http.get('/api/auth/me', () =>
        HttpResponse.json({ email: 'user@test.com', role: 'USER' }),
      ),
    )
    render(<OAuthCallbackPage />, { wrapper })
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }))
    expect(localStorage.getItem('daybrew_role')).toBe('USER')
  })

  it('navigates to /login?error=oauth_error on API failure', async () => {
    server.use(
      http.get('/api/auth/me', () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
    )
    render(<OAuthCallbackPage />, { wrapper })
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/login?error=oauth_error', { replace: true }),
    )
  })
})
