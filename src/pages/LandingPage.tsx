import { useEffect, useRef, useState } from 'react'
import { getIdeas } from '@/api/ideas'
import { getMe, logout } from '@/api/auth'
import type { IdeaDto } from '@/types'
import { ScoreBar } from '@/components/ScoreBar'
import { TrackBadge } from '@/components/TrackBadge'
import { IdeaModal } from '@/components/IdeaModal'

const SignalIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="3" stroke="#7c3aed" strokeWidth="1.5"/>
    <path d="M6 14c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3 2"/>
    <path d="M2 14c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S2 20.627 2 14z" stroke="#7c3aed" strokeWidth="1.2" opacity="0.35"/>
    <path d="M14 11v-3M14 20v-3M11 14H8M20 14h-3" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const SparkleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M21.5 18l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" stroke="#7c3aed" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6"/>
    <path d="M7 18l.75 2.25L10 21l-2.25.75L7 24l-.75-2.25L4 21l2.25-.75L7 18z" stroke="#7c3aed" strokeWidth="1.2" strokeLinejoin="round" opacity="0.4"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="18" height="24" rx="2" stroke="#7c3aed" strokeWidth="1.5"/>
    <path d="M9 8h10M9 13h10M9 18h6" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 20l2 2 3-3" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const STEPS = [
  {
    Icon: SignalIcon,
    num: '01',
    title: '신호 수집',
    items: ['Reddit r/SaaS 커뮤니티', 'GitHub 트렌딩 레포', '바이럴 토픽'],
    desc: '매일 실제 개발자들이 반응하는 신호를 자동으로 수집합니다.',
  },
  {
    Icon: SparkleIcon,
    num: '02',
    title: 'AI 분석 · 채점',
    items: ['노이즈 제거', '시장 적합성 / 실현 가능성 채점', '아이디어로 변환'],
    desc: '수백 개의 신호 중 실제 만들 만한 것만 걸러냅니다.',
  },
  {
    Icon: DocumentIcon,
    num: '03',
    title: '기획서 전달',
    items: ['사용 목적 · 동작 방식', '추천 기술 스택', '세부 점수 breakdown'],
    desc: '한 장짜리 기획서로 매일 아침 정리됩니다.',
  },
]


function MockIdeaCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-[#7c3aed]/6 rounded-2xl blur-2xl pointer-events-none" />
      <div className="relative bg-[#faf9f6] rounded-xl border border-[#e8e0f0] p-5 shadow-[0_8px_32px_rgba(124,58,237,0.10)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-bold text-[#7c3aed] bg-[rgba(124,58,237,0.08)] px-2.5 py-1 rounded-md tracking-wide">SAAS</span>
          <span className="text-[15px] font-bold tabular-nums text-[#2a2433]">
            9.2<span className="text-[#6b6080] font-normal text-[13px]">/10</span>
          </span>
        </div>

        <h3 className="text-[15px] font-bold text-[#2a2433] mb-1.5 leading-snug">AI 기반 노코드 앱 빌더 플랫폼</h3>
        <p className="text-[13px] text-[#6b6080] mb-3 leading-relaxed">
          비개발자도 실용적인 웹앱을 만들 수 있는 AI-first 빌더. 수요 급증 중.
        </p>

        <div className="h-1.5 bg-[#e8e0f0] rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full bg-[#7c3aed]" style={{ width: '92%' }} />
        </div>

        <div className="space-y-1.5 mb-3">
          {([['시장 적합성', 95], ['실현 가능성', 85], ['수익화', 90]] as [string, number][]).map(([label, pct]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[12px] text-[#6b6080] w-20 shrink-0">{label}</span>
              <div className="flex-1 h-1 bg-[#e8e0f0] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#7c3aed]/50" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#e8e0f0] flex items-center justify-between">
          <span className="text-[12px] text-[#6b6080]">Reddit r/SaaS · 오늘 09:00</span>
          <span className="text-[12px] font-bold text-[#7c3aed]">★ 24</span>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [ideas, setIdeas] = useState<IdeaDto[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('daybrew_role'))
  const [userLabel, setUserLabel] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [selectedIdeaId, setSelectedIdeaId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  function fetchIdeas() {
    setStatus('loading')
    getIdeas({ size: 3 })
      .then(p => { setIdeas(p.content); setStatus('ready') })
      .catch(() => setStatus('error'))
  }

  function handleLogout() {
    logout().finally(() => {
      localStorage.removeItem('daybrew_role')
      localStorage.removeItem('daybrew_auth')
      setRole(null)
      setUserLabel(null)
    })
  }

  useEffect(() => { fetchIdeas() }, [])

  useEffect(() => {
    getMe()
      .then(me => {
        localStorage.setItem('daybrew_role', me.role)
        localStorage.setItem('daybrew_auth', 'oauth')
        setRole(me.role)
        setUserLabel(me.email.split('@')[0])
      })
      .catch(() => {
        localStorage.removeItem('daybrew_role')
        localStorage.removeItem('daybrew_auth')
        setRole(null)
        setUserLabel(null)
      })
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [showMenu])

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#4a4458] tracking-[-0.3px]">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-[#faf9f6]/90 backdrop-blur border-b border-[#e8e0f0] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-[#2a2433]">daybrew</span>
          <div className="flex items-center gap-3">
            {role === 'ADMIN' && (
              <a
                href="/dashboard"
                className="text-[14px] font-medium text-[#7c3aed] border border-[#e8e0f0] px-4 py-2 rounded-lg hover:border-[#7c3aed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.5)]"
              >
                대시보드
              </a>
            )}
            {role && userLabel ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setShowMenu(v => !v)}
                  className="flex items-center gap-2 text-[14px] font-medium text-[#2a2433] border border-[#e8e0f0] px-4 py-2 rounded-lg hover:border-[#d9cce8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.5)]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {userLabel[0].toUpperCase()}
                  </span>
                  {userLabel}
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-[#e8e0f0] rounded-lg shadow-lg py-1 z-20">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-[13px] text-[#4a4458] hover:bg-[#f3f0ec] transition-colors"
                    >
                      내 계정
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[13px] text-[#4a4458] hover:bg-[#f3f0ec] transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-[14px] font-bold text-white bg-[#7c3aed] px-5 py-2.5 rounded-lg hover:bg-[#6d28d9] active:bg-[#5b21b6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.5)] shadow-sm"
              >
                시작하기
              </a>
            )}
          </div>
        </div>
      </nav>

      <main>
      {/* Hero */}
      <section className="border-b border-[#e8e0f0]">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[14px] font-bold text-[#7c3aed] mb-5 tracking-wider uppercase">
                매일 아침 업데이트
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2a2433] mb-6 leading-[1.1] select-none">
                만들 만한<br />아이디어를<br />매일 아침<br />골라드립니다
              </h1>
              <p className="text-[15px] text-[#6b6080] mb-8 leading-relaxed">
                Reddit, GitHub의 실제 신호에서 추출한 개발 아이디어.<br />
                사용 목적부터 기술 스택 추천까지 한 장으로 정리해드립니다.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="#ideas"
                  className="bg-[#7c3aed] text-white font-bold text-[14px] px-7 py-3 rounded-lg hover:bg-[#6d28d9] active:bg-[#5b21b6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)]"
                >
                  오늘의 아이디어 보기
                </a>
                <a
                  href="#how-it-works"
                  className="border border-[#e8e0f0] text-[#2a2433] font-bold text-[14px] px-7 py-3 rounded-lg hover:border-[#d9cce8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)]"
                >
                  어떻게 동작하나요
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <MockIdeaCard />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2a2433] text-center mb-3">어떻게 동작하나요</h2>
          <p className="text-[14px] text-[#6b6080] text-center mb-12">매일 자동으로 실행되는 3단계 파이프라인</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map(({ Icon, num, title, items, desc }) => (
              <div key={num} className="bg-[#f3f0ec] rounded-xl border border-[#e8e0f0] p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-[rgba(124,58,237,0.08)] rounded-xl">
                    <Icon />
                  </div>
                  <span className="text-3xl font-bold text-[#c9bedd] leading-none" aria-hidden="true">{num}</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#2a2433] mb-2">{title}</h3>
                  <p className="text-[13px] text-[#6b6080] mb-3 leading-relaxed">{desc}</p>
                  <ul className="space-y-1">
                    {items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-[13px] text-[#4a4458]">
                        <span className="w-1 h-1 rounded-full bg-[#7c3aed] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live ideas */}
      <section id="ideas" className="py-24 bg-[#f3f0ec] border-t border-b border-[#e8e0f0]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2a2433] text-center mb-3">오늘의 아이디어</h2>
          <p className="text-[14px] text-[#6b6080] text-center mb-10">실제로 수집된 최신 아이디어입니다</p>

          {status === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="border border-[#e8e0f0] rounded-xl p-5 bg-[#faf9f6]">
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 w-16 bg-[#e8e0f0] rounded-md" />
                    <div className="h-4 w-3/4 bg-[#e8e0f0] rounded" />
                    <div className="h-3 w-full bg-[#e8e0f0] rounded" />
                    <div className="h-3 w-2/3 bg-[#e8e0f0] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-12">
              <p className="text-[14px] text-[#6b6080] mb-4">아이디어를 불러올 수 없습니다.</p>
              <button
                onClick={fetchIdeas}
                className="text-[14px] font-bold text-[#7c3aed] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)] rounded"
              >
                다시 시도
              </button>
            </div>
          )}

          {status === 'ready' && ideas.length === 0 && (
            <p className="text-center py-12 text-[14px] text-[#6b6080]">아직 오늘의 아이디어가 준비되지 않았습니다.</p>
          )}

          {status === 'ready' && ideas.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ideas.map(idea => (
                  <div
                    key={idea.id}
                    role="article"
                    tabIndex={0}
                    onClick={() => setSelectedIdeaId(idea.id)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedIdeaId(idea.id)}
                    className="cursor-pointer border border-[#e8e0f0] rounded-xl p-5 bg-[#faf9f6] hover:border-[#d9cce8] hover:shadow-[0_4px_16px_rgba(124,58,237,0.08)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.4)]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <TrackBadge track={idea.sourceTrack} />
                      {idea.score !== null && (
                        <span className="text-[14px] font-bold tabular-nums text-[#2a2433]">
                          {idea.score}<span className="text-[#6b6080] font-normal">/10</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-bold text-[#2a2433] mb-2 line-clamp-2 leading-snug">{idea.title}</h3>
                    {idea.purpose
                      ? <p className="text-[14px] text-[#6b6080] line-clamp-3 mb-3 leading-relaxed">{idea.purpose}</p>
                      : <p className="text-[14px] text-[#6b6080] line-clamp-3 mb-3 leading-relaxed">{idea.description}</p>
                    }
                    <ScoreBar score={idea.score} />
                  </div>
                ))}
              </div>
              {!role && (
                <p className="text-center mt-8 text-[14px] text-[#6b6080]">
                  <a href="/login" className="text-[#7c3aed] hover:underline font-bold">로그인</a>하여 전체 피드와 상세 기획서를 확인하세요.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      </main>

      <IdeaModal ideaId={selectedIdeaId} onClose={() => setSelectedIdeaId(null)} />

      {/* Footer */}
      <footer className="border-t border-[#e8e0f0] py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[15px] font-bold text-[#2a2433]">daybrew</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <p className="text-[14px] text-[#6b6080]">매일 아침 개발 아이디어를 배달합니다</p>
            <a href="/privacy" className="text-[14px] text-[#6b6080] hover:text-[#4a4458] transition-colors">개인정보처리방침</a>
            <a href="/terms" className="text-[14px] text-[#6b6080] hover:text-[#4a4458] transition-colors">이용약관</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
