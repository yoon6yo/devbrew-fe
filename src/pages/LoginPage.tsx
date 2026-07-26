import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '@/api/client'
import { getMe } from '@/api/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      localStorage.setItem('devbrew_token', res.token)
      try {
        const me = await getMe()
        localStorage.setItem('daybrew_role', me.role)
      } catch {}
      navigate('/dashboard', { replace: true })
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e0e0e0] rounded p-8 w-full max-w-sm shadow-[0_2px_5px_rgba(63,71,77,0.15)]">
        <div className="mb-6">
          <Link to="/" className="text-xs text-[#828c94] hover:text-[#00a1ff] transition-colors">← 홈으로</Link>
          <h1 className="text-xl font-bold text-[#2f3438] mt-3">관리자 로그인</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[14px] text-[#828c94] mb-1.5">아이디</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-[#e0e0e0] rounded px-3 py-2 text-[15px] text-[#2f3438] focus:outline-none focus:ring-2 focus:ring-[#00a1ff] focus:border-transparent transition-all"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[14px] text-[#828c94] mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#e0e0e0] rounded px-3 py-2 text-[15px] text-[#2f3438] focus:outline-none focus:ring-2 focus:ring-[#00a1ff] focus:border-transparent transition-all"
              required
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a1ff] text-white font-bold text-[14px] py-2.5 rounded hover:bg-[#0090e8] transition-colors disabled:opacity-30"
          >
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
