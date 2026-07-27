import { describe, it, expect } from 'vitest'
import { server } from '@/test/server'
import { http, HttpResponse } from 'msw'
import { apiFetch } from './client'

describe('apiFetch', () => {
  it('throws ApiError on non-2xx response', async () => {
    server.use(
      http.get('/api/test', () => HttpResponse.json({ message: 'Not found' }, { status: 404 }))
    )
    await expect(apiFetch('/api/test')).rejects.toMatchObject({ status: 404 })
  })

  it('returns parsed JSON on 2xx', async () => {
    server.use(
      http.get('/api/test', () => HttpResponse.json({ ok: true }))
    )
    const result = await apiFetch<{ ok: boolean }>('/api/test')
    expect(result.ok).toBe(true)
  })

  it('returns undefined on 204 No Content without calling json()', async () => {
    server.use(
      http.post('/api/test', () => new HttpResponse(null, { status: 204 }))
    )
    const result = await apiFetch<void>('/api/test', { method: 'POST' })
    expect(result).toBeUndefined()
  })
})
