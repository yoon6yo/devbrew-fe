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
        navigate('/login?error=oauth_error', { replace: true })
      })
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center gap-4">
      <svg
        className="animate-spin text-[#7c3aed]"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-[14px] text-[#8b8398]">로그인 처리 중…</p>
    </div>
  )
}
