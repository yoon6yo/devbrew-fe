import { apiFetch } from './client'

export interface MeResponse {
  email: string
  role: string
  provider: string
  joinedAt: string | null
}

export function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/auth/me')
}

export function logout(): Promise<void> {
  return apiFetch<void>('/api/auth/logout', { method: 'POST' })
}
