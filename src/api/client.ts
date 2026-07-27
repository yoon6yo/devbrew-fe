export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('devbrew_token')
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...init?.headers },
    ...init,
    credentials: 'include',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new ApiError(res.status, `${res.status}: ${body}`)
  }
  if (res.status === 204 || res.headers.get('Content-Length') === '0') {
    return undefined as T
  }
  return res.json() as Promise<T>
}
