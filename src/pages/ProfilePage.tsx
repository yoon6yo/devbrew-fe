import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, logout, updateNickname } from '@/api/auth'
import type { MeResponse } from '@/api/auth'

const PROVIDER_LABEL: Record<string, string> = {
  GOOGLE: 'Google',
  KAKAO: '카카오',
  LOCAL: '이메일',
  GITHUB: 'GitHub',
}

function formatDate(iso: string | null): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [me, setMe] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [nicknameInput, setNicknameInput] = useState('')
  const [nicknameSaving, setNicknameSaving] = useState(false)
  const [nicknameSaved, setNicknameSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getMe()
      .then(data => { setMe(data); setNicknameInput(data.nickname ?? ''); setLoading(false) })
      .catch(() => navigate('/login', { replace: true }))
  }, [navigate])

  function handleSaveNickname() {
    if (nicknameSaving) return
    setNicknameSaving(true)
    updateNickname(nicknameInput.trim())
      .then(() => {
        setMe(prev => prev ? { ...prev, nickname: nicknameInput.trim() || null } : prev)
        setNicknameSaved(true)
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => setNicknameSaved(false), 2000)
      })
      .finally(() => setNicknameSaving(false))
  }

  function handleLogout() {
    logout().finally(() => {
      localStorage.removeItem('daybrew_role')
      localStorage.removeItem('daybrew_auth')
      navigate('/', { replace: true })
    })
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#4a4458] tracking-[-0.3px]">
      <nav className="sticky top-0 z-10 bg-[#faf9f6]/90 backdrop-blur border-b border-[#e8e0f0] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-[#2a2433]">daybrew</a>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-[#2a2433] mb-8">내 계정</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 bg-[#e8e0f0] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : me ? (
          <div className="space-y-3">
            <div className="bg-white border border-[#e8e0f0] rounded-xl px-5 py-4">
              <p className="text-[12px] font-bold text-[#9b91b0] uppercase tracking-wider mb-2">닉네임</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={e => setNicknameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveNickname()}
                  maxLength={50}
                  placeholder="닉네임 입력 (미입력 시 이메일 앞부분 사용)"
                  className="flex-1 text-[14px] text-[#2a2433] border border-[#e8e0f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(124,58,237,0.4)] placeholder:text-[#c9bedd]"
                />
                <button
                  onClick={handleSaveNickname}
                  disabled={nicknameSaving}
                  className="text-[13px] font-bold px-4 py-2 rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] disabled:opacity-50 transition-colors"
                >
                  {nicknameSaved ? '저장됨 ✓' : '저장'}
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#e8e0f0] rounded-xl px-5 py-4">
              <p className="text-[12px] font-bold text-[#9b91b0] uppercase tracking-wider mb-1">이메일</p>
              <p className="text-[15px] font-medium text-[#2a2433]">{me.email}</p>
            </div>

            <div className="bg-white border border-[#e8e0f0] rounded-xl px-5 py-4">
              <p className="text-[12px] font-bold text-[#9b91b0] uppercase tracking-wider mb-1">로그인 방식</p>
              <p className="text-[15px] font-medium text-[#2a2433]">{PROVIDER_LABEL[me.provider] ?? me.provider}</p>
            </div>

            <div className="bg-white border border-[#e8e0f0] rounded-xl px-5 py-4">
              <p className="text-[12px] font-bold text-[#9b91b0] uppercase tracking-wider mb-1">권한</p>
              <div className="flex items-center gap-2">
                <span className={`text-[12px] font-bold px-2.5 py-1 rounded-md ${
                  me.role === 'ADMIN'
                    ? 'bg-[rgba(124,58,237,0.1)] text-[#7c3aed]'
                    : 'bg-[#f3f0ec] text-[#6b6080]'
                }`}>
                  {me.role === 'ADMIN' ? '관리자' : '일반 사용자'}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e8e0f0] rounded-xl px-5 py-4">
              <p className="text-[12px] font-bold text-[#9b91b0] uppercase tracking-wider mb-1">가입일</p>
              <p className="text-[15px] font-medium text-[#2a2433]">{formatDate(me.joinedAt)}</p>
            </div>

            {me.role === 'ADMIN' && (
              <a
                href="/dashboard"
                className="block w-full text-center bg-[rgba(124,58,237,0.08)] border border-[#e8e0f0] text-[#7c3aed] font-bold text-[14px] px-5 py-3 rounded-xl hover:bg-[rgba(124,58,237,0.13)] transition-colors"
              >
                관리자 대시보드 →
              </a>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-center border border-[#e8e0f0] text-[#6b6080] text-[14px] px-5 py-3 rounded-xl hover:border-[#d9cce8] hover:text-[#2a2433] transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}
