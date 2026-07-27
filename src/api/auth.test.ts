import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { getMe, logout } from './auth'

describe('getMe', () => {
  it('fetches current user email and role', async () => {
    server.use(
      http.get('/api/auth/me', () =>
        HttpResponse.json({ email: 'admin@test.com', role: 'ADMIN' }),
      ),
    )
    const me = await getMe()
    expect(me.email).toBe('admin@test.com')
    expect(me.role).toBe('ADMIN')
  })

  it('throws ApiError on 401', async () => {
    server.use(
      http.get('/api/auth/me', () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
    )
    await expect(getMe()).rejects.toMatchObject({ status: 401 })
  })
})

describe('logout', () => {
  it('resolves without value on 204', async () => {
    server.use(
      http.post('/api/auth/logout', () => new HttpResponse(null, { status: 204 })),
    )
    await expect(logout()).resolves.toBeUndefined()
  })
})
