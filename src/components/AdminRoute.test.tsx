import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, afterEach } from 'vitest'
import React from 'react'
import { AdminRoute } from './AdminRoute'

afterEach(() => localStorage.clear())

function renderWithRouter(
  initialPath: string,
  localStorageEntries: Record<string, string> = {},
) {
  Object.entries(localStorageEntries).forEach(([k, v]) => localStorage.setItem(k, v))
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<p>login-page</p>} />
        <Route path="/" element={<p>home-page</p>} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <p>admin-content</p>
            </AdminRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithRouter('/dashboard')
    expect(screen.getByText('login-page')).toBeInTheDocument()
  })

  it('redirects to / when authenticated but not admin', () => {
    renderWithRouter('/dashboard', { daybrew_auth: 'oauth', daybrew_role: 'USER' })
    expect(screen.getByText('home-page')).toBeInTheDocument()
  })

  it('renders children when authenticated as admin', () => {
    renderWithRouter('/dashboard', { daybrew_auth: 'oauth', daybrew_role: 'ADMIN' })
    expect(screen.getByText('admin-content')).toBeInTheDocument()
  })

  it('authenticates via devbrew_token as well as daybrew_auth', () => {
    renderWithRouter('/dashboard', { devbrew_token: 'jwt-token', daybrew_role: 'ADMIN' })
    expect(screen.getByText('admin-content')).toBeInTheDocument()
  })
})
