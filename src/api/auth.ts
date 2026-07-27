import { apiFetch } from './client'

export interface MeResponse {
  email: string
  role: string
  provider: string
  joinedAt: string | null
  nickname: string | null
}

export function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/auth/me')
}

export function updateNickname(nickname: string): Promise<void> {
  return apiFetch('/api/auth/me/nickname', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  })
}

export function logout(): Promise<void> {
  return apiFetch<void>('/api/auth/logout', { method: 'POST' })
}
