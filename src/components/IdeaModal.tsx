import { useEffect, useState } from 'react'
import { useIdeaDetail } from '@/hooks/useIdeaDetail'
import { useRejectIdea } from '@/hooks/useRejectIdea'
import { useScoreIdea } from '@/hooks/useScoreIdea'
import { useNotifyIdea } from '@/hooks/useNotifyIdea'
import { useStarIdea } from '@/hooks/useStarIdea'
import { StatusBadge } from './StatusBadge'
import { TrackBadge } from './TrackBadge'
import { ScoreRing, scoreStyle } from './ScoreRing'
import { formatDate } from '@/utils/dateFormat'
import { Button } from '@/components/ui/button'

function SectionBox({ title, accent = false, children }: { title: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`w-0.5 h-3.5 rounded-full shrink-0 ${accent ? 'bg-[#7c3aed]' : 'bg-[#e0d8f0]'}`} />
        <p className={`text-[11px] font-bold uppercase tracking-wider ${accent ? 'text-[#7c3aed]' : 'text-[#a89ec0]'}`}>{title}</p>
      </div>
      <div className="text-[14px] text-[#4a4458] leading-relaxed">{children}</div>
    </div>
  )
}

function parseSteps(text: string): string[] {
  const byNewline = text.split('\n').map(s => s.trim()).filter(Boolean)
  if (byNewline.length > 1) return byNewline
  const parts = text.split(/\s+(?=[②③④⑤]|\d+[.．]\s)/).map(s => s.trim()).filter(Boolean)
  return parts.length > 1 ? parts : [text]
}

function cleanStep(step: string): string {
  return step.replace(/^[①②③④⑤]\s*|^\d+[.．]\s*/, '').trim()
}

function UsageSteps({ text }: { text: string }) {
  const steps = parseSteps(text)
  if (steps.length === 1) {
    return <p className="text-[14px] text-[#4a4458] leading-relaxed whitespace-pre-line">{text}</p>
  }
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-[11px] font-bold flex items-center justify-center">
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-[#ede8f7] my-1" style={{ minHeight: '12px' }} />
            )}
          </div>
          <p className="text-[13px] text-[#4a4458] leading-relaxed pb-3">{cleanStep(step)}</p>
        </div>
      ))}
    </div>
  )
}

function StackChips({ text }: { text: string }) {
  const items = text.split(/[,\n·•]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50)
  if (items.length <= 1) {
    return <p className="text-[14px] text-[#4a4458] leading-relaxed">{text}</p>
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="text-[12px] px-2.5 py-1 rounded-full bg-[rgba(124,58,237,0.07)] border border-[rgba(124,58,237,0.2)] text-[#5b21b6] font-medium"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

interface ImplItem { title: string; purpose: string | null; method: string | null }

function parseImplGuide(text: string): ImplItem[] {
  const sections = text.split(/\n(?=\d+\.\s)/).filter(Boolean)
  if (sections.length < 2) return []
  return sections.map(section => {
    const lines = section.split('\n').map(s => s.trim()).filter(Boolean)
    const title = lines[0]?.replace(/^\d+\.\s*/, '') ?? ''
    let purpose: string | null = null
    let method: string | null = null
    for (const line of lines.slice(1)) {
      if (line.startsWith('- 사용 목적:')) purpose = line.replace('- 사용 목적:', '').trim()
      else if (line.startsWith('- 구현:')) method = line.replace('- 구현:', '').trim()
    }
    return { title, purpose, method }
  })
}

function ImplementationGuide({ text }: { text: string }) {
  const items = parseImplGuide(text)
  if (!items.length) {
    return <p className="text-[13px] text-[#4a4458] leading-relaxed whitespace-pre-line">{text}</p>
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <div className="shrink-0 w-6 h-6 rounded-full bg-[rgba(124,58,237,0.12)] text-[#7c3aed] text-[11px] font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#2a2433] mb-1">{item.title}</p>
            {item.purpose && (
              <p className="text-[12px] text-[#6b6080] mb-0.5">
                <span className="text-[#a89ec0] font-medium">목적</span>&ensp;{item.purpose}
              </p>
            )}
            {item.method && (
              <p className="text-[12px] text-[#4a4458]">
                <span className="text-[#a89ec0] font-medium">구현</span>&ensp;{item.method}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function IdeaModal({ ideaId, onClose }: { ideaId: number | null; onClose: () => void }) {
  const { data: idea, isLoading, isError } = useIdeaDetail(ideaId)
  const reject = useRejectIdea()
  const score = useScoreIdea()
  const notify = useNotifyIdea()
  const isAdmin = localStorage.getItem('daybrew_role') === 'ADMIN'
  const [notifyDone, setNotifyDone] = useState(false)
  const star = useStarIdea(ideaId ?? -1)

  useEffect(() => {
    if (ideaId === null) return
    setNotifyDone(false)
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [ideaId, onClose])

  function handleNotify(id: number) {
    notify.mutate(id, {
      onSuccess: () => {
        setNotifyDone(true)
        setTimeout(onClose, 1400)
      },
    })
  }

  if (ideaId === null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-2xl border border-[#ede8f7] w-full max-w-3xl mx-4 shadow-[0_24px_64px_rgba(80,40,140,0.13)] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-[#f0ebfa] animate-pulse rounded" />)}
          </div>
        ) : isError ? (
          <div className="p-8 text-center py-10">
            <p className="text-[#9b91b0] text-[15px] mb-3">아이디어 정보를 불러올 수 없습니다.</p>
            <button onClick={onClose} className="text-[14px] text-[#7c3aed] hover:underline">닫기</button>
          </div>
        ) : idea ? (
          <>
            {/* Hero header */}
            <div className="shrink-0 px-7 pt-6 pb-5 bg-gradient-to-b from-[#f3eeff] to-white border-b border-[#ede8f7]/60">
              {/* Top row: badges + close */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={idea.status} />
                  <TrackBadge track={idea.sourceTrack} />
                </div>
                <button
                  aria-label="닫기"
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#b0a4c8] hover:text-[#4a4458] hover:bg-[#ede8f7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]/40"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>

              {/* Title + ScoreRing */}
              <div className="flex items-start gap-4">
                <h2 id="modal-title" className="text-[19px] font-bold text-[#2a2433] leading-snug flex-1">
                  {idea.title}
                </h2>
                <div className="shrink-0 mt-0.5">
                  <ScoreRing score={idea.score} size={56} />
                </div>
              </div>

              {/* Score tier label */}
              {idea.score !== null && (
                <div className="mt-2">
                  {(() => {
                    const { color } = scoreStyle(idea.score)
                    const tier = idea.score >= 9 ? '최상위 아이디어' : idea.score >= 8 ? '탁월한 아이디어' : idea.score >= 7 ? '강한 아이디어' : idea.score >= 5 ? '평균 이상' : '재검토 필요'
                    return <span className="text-[11px] font-bold" style={{ color }}>{tier}</span>
                  })()}
                </div>
              )}

              {/* Star button — hero area */}
              {(idea.status === 'NOTIFIED' || idea.status === 'FEATURED') && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#ede8f7]/60">
                  <button
                    onClick={() => star.toggle(star.localCount ?? idea.starCount)}
                    disabled={star.pending}
                    aria-label={star.starred ? '스타 취소' : '스타 추가'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-bold transition-all disabled:opacity-60 ${
                      star.starred
                        ? 'bg-[#7c3aed] text-white shadow-[0_2px_8px_rgba(124,58,237,0.25)]'
                        : 'bg-[rgba(124,58,237,0.08)] text-[#7c3aed] hover:bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.2)]'
                    }`}
                  >
                    <span className="text-[15px] leading-none">{star.starred ? '★' : '☆'}</span>
                    <span className="tabular-nums">{star.localCount ?? idea.starCount}</span>
                  </button>
                  <span className="text-[12px] text-[#a89ec0]">
                    {star.starred ? '스타 취소하려면 다시 클릭' : '유망한 아이디어라면 스타를 눌러주세요'}
                  </span>
                </div>
              )}
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-7 py-6 flex-1">
              {/* Description callout */}
              {idea.description && (
                <div className="mb-6 px-4 py-4 bg-gradient-to-r from-[rgba(124,58,237,0.07)] to-[rgba(124,58,237,0.01)] border-l-[3px] border-[#7c3aed] rounded-r-xl">
                  <p className="text-[15px] text-[#2a2433] leading-relaxed font-medium">{idea.description}</p>
                </div>
              )}

              {idea.purpose && (
                <SectionBox title="왜 필요한가">
                  {idea.purpose}
                </SectionBox>
              )}

              {idea.howItWorks && (
                <SectionBox title="사용 방법">
                  <UsageSteps text={idea.howItWorks} />
                </SectionBox>
              )}

              {idea.implementationGuide && (
                <SectionBox title="구현 방법" accent>
                  <ImplementationGuide text={idea.implementationGuide} />
                </SectionBox>
              )}

              {idea.suggestedStack && (
                <SectionBox title="기술 스택" accent>
                  <StackChips text={idea.suggestedStack} />
                </SectionBox>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-1 mb-6 text-[12px] text-[#c4b8d4]">
                <span>{formatDate(idea.createdAt)}</span>
                {idea.sourceUrl && (
                  <>
                    <span>·</span>
                    <a
                      href={idea.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7c3aed] hover:underline"
                    >
                      원본 보기 ↗
                    </a>
                  </>
                )}
              </div>

              {/* Admin area */}
              {isAdmin && (
                <>
                  {idea.scoreMarketFit != null && (
                    <SectionBox title="세부 채점" accent>
                      <div className="space-y-2">
                        {([
                          ['시장 적합성', idea.scoreMarketFit],
                          ['참신성',      idea.scoreNovelty],
                          ['실현 가능성', idea.scoreFeasibility],
                          ['수익화',      idea.scoreMonetization],
                          ['트렌드',      idea.scoreTrend],
                        ] as [string, number | null][]).map(([label, val]) => {
                          const color = val === null ? '#c4b8d4'
                            : val >= 8 ? '#10b981'
                            : val >= 6 ? '#7c3aed'
                            : val >= 4 ? '#f59e0b'
                            : '#ef4444'
                          return (
                            <div key={label} className="flex items-center gap-2">
                              <span className="text-[12px] text-[#6b6080] w-20 shrink-0">{label}</span>
                              <div className="flex-1 h-1.5 bg-[#f0ebfa] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${((val ?? 0) / 10) * 100}%`, backgroundColor: color }}
                                />
                              </div>
                              <span className="text-[12px] font-bold tabular-nums w-5 text-right" style={{ color }}>{val}</span>
                            </div>
                          )
                        })}
                      </div>
                    </SectionBox>
                  )}

                  {idea.scoreReason && (
                    <SectionBox title="채점 이유" accent>
                      {idea.scoreReason}
                    </SectionBox>
                  )}

                  {/* Lifecycle */}
                  <div className="mb-4 rounded-xl border border-[rgba(124,58,237,0.15)] bg-[rgba(124,58,237,0.03)] overflow-hidden">
                    <div className="px-5 pt-4 pb-0 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#7c3aed]" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#7c3aed]">라이프사이클</p>
                    </div>
                    <div className="px-5 pt-3 pb-4">
                      {/* Stage indicator */}
                      <div className="flex items-center gap-1 mb-3.5 text-[11px] flex-wrap">
                        {(['PENDING', 'SCORED', 'NOTIFIED', 'FEATURED'] as const).map((s, i) => {
                          const labels: Record<string, string> = { PENDING: '수집됨', SCORED: '채점완료', NOTIFIED: '공시됨', FEATURED: '★ 피처됨' }
                          const rankMap: Record<string, number> = { PENDING: 0, SCORED: 1, NOTIFIED: 2, FEATURED: 3 }
                          const currentRank = rankMap[idea.status] ?? -1
                          const active = idea.status === s
                          const done = currentRank > i && currentRank >= 0
                          return (
                            <div key={s} className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-full font-semibold ${
                                active ? 'bg-[#7c3aed] text-white' :
                                done   ? 'bg-[#ede8f7] text-[#7c3aed]' :
                                         'bg-[#f5f3ff] text-[#c4b8d4]'
                              }`}>{labels[s]}</span>
                              {i < 3 && <span className="text-[#d8d0e8]">→</span>}
                            </div>
                          )
                        })}
                        {idea.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-600 ml-1">거절됨</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {idea.status === 'PENDING' && (
                          <Button
                            size="sm"
                            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                            disabled={score.isPending}
                            onClick={() => score.mutate(idea.id, { onSuccess: onClose })}
                          >
                            {score.isPending ? '채점 중…' : '채점 요청 →'}
                          </Button>
                        )}
                        {idea.status === 'SCORED' && (
                          <Button
                            size="sm"
                            className={notifyDone
                              ? 'bg-emerald-500 text-white cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
                            disabled={notify.isPending || notifyDone}
                            onClick={() => handleNotify(idea.id)}
                          >
                            {notifyDone ? '✓ 공시 완료' : notify.isPending ? '공시 중…' : '공시하기 → Slack'}
                          </Button>
                        )}
                        {idea.status !== 'REJECTED' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={reject.isPending}
                            onClick={() => reject.mutate(idea.id, { onSuccess: onClose })}
                          >
                            {reject.isPending ? '처리 중…' : '거절'}
                          </Button>
                        )}
                      </div>
                      {(score.isError || notify.isError || reject.isError) && (
                        <p role="alert" className="text-xs text-red-500 mt-1.5">처리에 실패했습니다. 다시 시도해 주세요.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
