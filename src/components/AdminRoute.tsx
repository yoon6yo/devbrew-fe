import { Navigate } from 'react-router-dom'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated =
    localStorage.getItem('devbrew_token') !== null ||
    localStorage.getItem('daybrew_auth') !== null
  const isAdmin = localStorage.getItem('daybrew_role') === 'ADMIN'

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}
