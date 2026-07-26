import { useEffect, useState } from 'react'
import { getIdeas } from '@/api/ideas'
import type { IdeaDto } from '@/types'
import { ScoreBar } from '@/components/ScoreBar'
import { TrackBadge } from '@/components/TrackBadge'

const STEPS = [
  {
    num: '01',
    title: '신호 수집',
    desc: 'Reddit SaaS 커뮤니티, GitHub 급상승 레포, 바이럴 토픽에서 매일 트렌드 신호를 수집합니다.',
  },
  {
    num: '02',
    title: 'AI 분석',
    desc: '노이즈를 걸러내고 실제 개발 프로젝트로 만들 수 있는 아이디어로 변환합니다.',
  },
  {
    num: '03',
    title: '기획서 전달',
    desc: '사용 목적, 동작 방식, 기술 스택 추천까지 한 장짜리 기획서로 매일 아침 정리해드립니다.',
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '무료',
    features: ['주 3개 아이디어 미리보기', '기본 정보 (제목 + 점수)', '웹 대시보드 접근'],
    cta: '무료로 시작',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₩9,900/월',
    features: ['매일 전체 피드', '상세 기획서 (목적 + 동작 + 스택)', 'CSV/JSON 내보내기', '이메일 알림'],
    cta: '7일 무료 체험',
    highlight: true,
  },
]

export default function LandingPage() {
  const [ideas, setIdeas] = useState<IdeaDto[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

  useEffect(() => {
    getIdeas({ size: 3 })
      .then(p => {
        setIdeas(p.content)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#4a4458] tracking-[-0.3px]">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-[#faf9f6]/90 backdrop-blur border-b border-[#e8e0f0] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-[#2a2433]">DevBrew</span>
          <a
            href="#pricing"
            className="text-[14px] font-bold text-[#2a2433] border border-[#e8e0f0] px-4 py-2 rounded-lg hover:border-[#d9cce8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)]"
          >
            시작하기
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-[#e8e0f0]">
        <div className="max-w-4xl mx-auto px-6 py-28 text-center">
          <p className="text-[14px] font-bold text-[#7c3aed] mb-5 tracking-wider uppercase">
            매일 아침 업데이트
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#2a2433] mb-6 leading-[1.05]">
            만들 만한 아이디어를<br />매일 아침 골라드립니다
          </h1>
          <p className="text-base text-[#8b8398] mb-10 max-w-xl mx-auto leading-relaxed">
            Reddit, GitHub의 실제 신호에서 추출한 개발 아이디어.<br />
            사용 목적부터 기술 스택 추천까지 한 장으로 정리해드립니다.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
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
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2a2433] text-center mb-12">어떻게 동작하나요</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map(step => (
              <div key={step.num} className="bg-[#f3f0ec] rounded-xl border border-[#e8e0f0] p-6">
                <span className="text-4xl font-bold text-[#e8e0f0] mb-4 block">{step.num}</span>
                <h3 className="text-[15px] font-bold text-[#2a2433] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[#8b8398] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live ideas */}
      <section id="ideas" className="py-24 bg-[#f3f0ec] border-t border-b border-[#e8e0f0]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2a2433] text-center mb-3">오늘의 아이디어</h2>
          <p className="text-[14px] text-[#8b8398] text-center mb-10">실제로 수집된 최신 아이디어입니다</p>

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
              <p className="text-[14px] text-[#8b8398] mb-4">아이디어를 불러올 수 없습니다.</p>
              <button
                onClick={() => {
                  setStatus('loading')
                  getIdeas({ size: 3 })
                    .then(p => { setIdeas(p.content); setStatus('ready') })
                    .catch(() => setStatus('error'))
                }}
                className="text-[14px] font-bold text-[#7c3aed] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)] rounded"
              >
                다시 시도
              </button>
            </div>
          )}

          {status === 'ready' && ideas.length === 0 && (
            <p className="text-center py-12 text-[14px] text-[#8b8398]">아직 오늘의 아이디어가 준비되지 않았습니다.</p>
          )}

          {status === 'ready' && ideas.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ideas.map(idea => (
                  <div
                    key={idea.id}
                    role="article"
                    className="border border-[#e8e0f0] rounded-xl p-5 bg-[#faf9f6] hover:border-[#d9cce8] hover:shadow-[0_4px_16px_rgba(124,58,237,0.08)] transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <TrackBadge track={idea.sourceTrack} />
                      {idea.score !== null && (
                        <span className="text-[14px] font-bold tabular-nums text-[#2a2433]">{idea.score}<span className="text-[#8b8398] font-normal">/10</span></span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-bold text-[#2a2433] mb-2 line-clamp-2 leading-snug">{idea.title}</h3>
                    {idea.purpose
                      ? <p className="text-[14px] text-[#8b8398] line-clamp-3 mb-3 leading-relaxed">{idea.purpose}</p>
                      : <p className="text-[14px] text-[#8b8398] line-clamp-3 mb-3 leading-relaxed">{idea.description}</p>
                    }
                    <ScoreBar score={idea.score} />
                  </div>
                ))}
              </div>
              <p className="text-center mt-8 text-[14px] text-[#8b8398]">
                전체 피드와 상세 기획서는 <a href="#pricing" className="text-[#7c3aed] hover:underline font-bold">Pro 플랜</a>에서 확인하세요.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#2a2433] text-center mb-3">요금제</h2>
          <p className="text-[14px] text-[#8b8398] text-center mb-12">시작은 무료로. 필요할 때 업그레이드하세요.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 bg-[#f3f0ec] ${
                  plan.highlight
                    ? 'border-[#7c3aed] bg-[rgba(124,58,237,0.04)] shadow-[0_4px_16px_rgba(124,58,237,0.08)]'
                    : 'border-[#e8e0f0]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[15px] font-bold text-[#2a2433]">{plan.name}</span>
                  {plan.highlight && (
                    <span className="text-xs bg-[#7c3aed] text-white px-2 py-0.5 rounded-full font-bold">추천</span>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#2a2433] mb-6">{plan.price}</p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[14px] text-[#4a4458]">
                      <span className="text-[#7c3aed] mt-0.5 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className={`block w-full text-center py-2.5 rounded-lg text-[14px] font-bold transition-colors disabled:opacity-30 cursor-not-allowed ${
                    plan.highlight
                      ? 'bg-[#7c3aed] text-white'
                      : 'border border-[#e8e0f0] text-[#2a2433]'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e0f0] py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-[15px] font-bold text-[#2a2433]">DevBrew</span>
          <p className="text-[14px] text-[#8b8398]">매일 아침 개발 아이디어를 배달합니다</p>
        </div>
      </footer>
    </div>
  )
}
