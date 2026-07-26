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

  useEffect(() => {
    getIdeas({ size: 3 }).then(p => setIdeas(p.content)).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#e0e0e0] px-6 py-4">
        <span className="text-xl font-bold text-[#2f3438]">DevBrew</span>
      </nav>

      {/* Hero */}
      <section className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-[14px] font-bold text-[#00a1ff] mb-4 tracking-wider uppercase">
            매일 아침 업데이트
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2f3438] mb-6 leading-tight">
            만들 만한 아이디어를<br />매일 아침 골라드립니다
          </h1>
          <p className="text-[15px] text-[#828c94] mb-10 max-w-xl mx-auto leading-relaxed">
            Reddit, GitHub의 실제 신호에서 추출한 개발 아이디어.<br />
            사용 목적부터 기술 스택 추천까지 한 장으로 정리해드립니다.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="#ideas"
              className="bg-[#00a1ff] text-white font-bold text-[14px] px-7 py-3 rounded hover:bg-[#0090e8] transition-colors"
            >
              오늘의 아이디어 보기
            </a>
            <a
              href="#how-it-works"
              className="border border-[#e0e0e0] text-[#424242] font-bold text-[14px] px-7 py-3 rounded hover:border-[#c8c8c8] transition-colors"
            >
              어떻게 동작하나요
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#2f3438] text-center mb-12">어떻게 동작하나요</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map(step => (
              <div key={step.num} className="bg-white rounded border border-[#e0e0e0] p-6">
                <span className="text-3xl font-bold text-[#e0e0e0] mb-4 block">{step.num}</span>
                <h3 className="text-[15px] font-bold text-[#2f3438] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[#828c94] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live ideas */}
      {ideas.length > 0 && (
        <section id="ideas" className="py-20 bg-white border-t border-b border-[#e0e0e0]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#2f3438] text-center mb-3">오늘의 아이디어</h2>
            <p className="text-[14px] text-[#828c94] text-center mb-10">실제로 수집된 최신 아이디어입니다</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ideas.map(idea => (
                <div
                  key={idea.id}
                  className="border border-[#e0e0e0] rounded p-5 bg-[#f8f8f8] hover:border-[#c8c8c8] hover:shadow-[0_2px_5px_rgba(63,71,77,0.15)] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <TrackBadge track={idea.sourceTrack} />
                    {idea.score !== null && (
                      <span className="text-[14px] font-bold tabular-nums text-[#2f3438]">{idea.score}<span className="text-[#828c94] font-normal">/10</span></span>
                    )}
                  </div>
                  <h3 className="text-[15px] font-bold text-[#2f3438] mb-2 line-clamp-2 leading-snug">{idea.title}</h3>
                  {idea.purpose
                    ? <p className="text-[14px] text-[#828c94] line-clamp-3 mb-3 leading-relaxed">{idea.purpose}</p>
                    : <p className="text-[14px] text-[#828c94] line-clamp-3 mb-3 leading-relaxed">{idea.description}</p>
                  }
                  <ScoreBar score={idea.score} />
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-[14px] text-[#828c94]">
              전체 피드와 상세 기획서는 <a href="#pricing" className="text-[#00a1ff] hover:underline font-bold">Pro 플랜</a>에서 확인하세요.
            </p>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#2f3438] text-center mb-3">요금제</h2>
          <p className="text-[14px] text-[#828c94] text-center mb-12">시작은 무료로. 필요할 때 업그레이드하세요.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={`rounded border p-8 bg-white ${
                  plan.highlight
                    ? 'border-[#00a1ff] shadow-[0_2px_5px_rgba(63,71,77,0.15)]'
                    : 'border-[#e0e0e0]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[15px] font-bold text-[#2f3438]">{plan.name}</span>
                  {plan.highlight && (
                    <span className="text-xs bg-[#00a1ff] text-white px-2 py-0.5 rounded-full font-bold">추천</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-[#2f3438] mb-6">{plan.price}</p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[14px] text-[#424242]">
                      <span className="text-[#00a1ff] mt-0.5 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className={`block w-full text-center py-2.5 rounded text-[14px] font-bold transition-colors disabled:opacity-30 cursor-not-allowed ${
                    plan.highlight
                      ? 'bg-[#00a1ff] text-white'
                      : 'border border-[#e0e0e0] text-[#2f3438]'
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
      <footer className="border-t border-[#e0e0e0] py-8 bg-white">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-[15px] font-bold text-[#2f3438]">DevBrew</span>
          <p className="text-[14px] text-[#828c94]">매일 아침 개발 아이디어를 배달합니다</p>
        </div>
      </footer>
    </div>
  )
}
