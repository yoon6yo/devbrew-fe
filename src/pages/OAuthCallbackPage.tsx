import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('daybrew_auth', 'oauth')
    navigate('/dashboard', { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
      <p className="text-[14px] text-[#8b8398]">로그인 중…</p>
    </div>
  )
}
