import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { server } from '@/test/server'
import LoginPage from './LoginPage'

afterEach(() => localStorage.clear())

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('LoginPage', () => {
  it('renders accessible email and password fields', () => {
    render(<LoginPage />, { wrapper })
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('shows error message on 401 response', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
    )
    render(<LoginPage />, { wrapper })
    await userEvent.type(screen.getByLabelText('이메일'), 'bad@example.com')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'wrongpwd')
    await userEvent.click(screen.getByRole('button', { name: '로그인' }))
    await waitFor(() =>
      expect(
        screen.getByText('아이디 또는 비밀번호가 올바르지 않습니다.'),
      ).toBeInTheDocument(),
    )
  })

  it('sends email field (not username) in the request body', async () => {
    let capturedBody: Record<string, string> | null = null
    server.use(
      http.post('/api/auth/login', async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, string>
        return HttpResponse.json({ token: 'fake-jwt' })
      }),
      http.get('/api/auth/me', () =>
        HttpResponse.json({ email: 'admin@test.com', role: 'ADMIN' }),
      ),
    )
    render(<LoginPage />, { wrapper })
    await userEvent.type(screen.getByLabelText('이메일'), 'admin@test.com')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: '로그인' }))
    await waitFor(() => expect(capturedBody).not.toBeNull())
    expect(capturedBody!['email']).toBe('admin@test.com')
    expect(capturedBody!['username']).toBeUndefined()
  })
})
