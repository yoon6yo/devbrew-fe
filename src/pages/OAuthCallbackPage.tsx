import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/auth'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    getMe()
      .then((me) => {
        localStorage.setItem('daybrew_auth', 'oauth')
        localStorage.setItem('daybrew_role', me.role)
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        navigate('/login', { replace: true })
      })
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
      <p className="text-[14px] text-[#8b8398]">로그인 중…</p>
    </div>
  )
}
