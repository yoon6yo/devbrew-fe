import { apiFetch } from './client'

export interface MeResponse {
  email: string
  role: string
}

export function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/auth/me')
}
