import { useEffect } from 'react'
import { useIdeaDetail } from '@/hooks/useIdeaDetail'
import { useRejectIdea } from '@/hooks/useRejectIdea'
import { StatusBadge } from './StatusBadge'
import { TrackBadge } from './TrackBadge'
import { ScoreBar } from './ScoreBar'
import { formatDate } from '@/utils/dateFormat'
import { Button } from '@/components/ui/button'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 p-3.5 bg-[#faf9f6] border border-[#e8e0f0] rounded-xl">
      <p className="text-[11px] font-bold text-[#9b91b0] uppercase tracking-wider mb-2">{title}</p>
      <div className="text-[14px] text-[#4a4458] leading-relaxed">{children}</div>
    </div>
  )
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 p-3.5 bg-[rgba(124,58,237,0.04)] border border-[rgba(124,58,237,0.15)] rounded-xl">
      <p className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-wider mb-2">{title}</p>
      <div className="text-[14px] text-[#4a4458] leading-relaxed">{children}</div>
    </div>
  )
}

export function IdeaModal({ ideaId, onClose }: { ideaId: number | null; onClose: () => void }) {
  const { data: idea, isLoading, isError } = useIdeaDetail(ideaId)
  const reject = useRejectIdea()
  const isAdmin = localStorage.getItem('daybrew_role') === 'ADMIN'

  useEffect(() => {
    if (ideaId === null) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [ideaId, onClose])

  if (ideaId === null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-2xl border border-[#e8e0f0] w-full max-w-lg mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-[#e0e0e0] animate-pulse rounded" />)}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-[#828c94] text-[15px] mb-3">아이디어 정보를 불러올 수 없습니다.</p>
            <button onClick={onClose} className="text-[14px] text-[#00a1ff] hover:underline">닫기</button>
          </div>
        ) : idea ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 id="modal-title" className="text-[17px] font-bold text-[#2a2433] leading-snug flex-1">{idea.title}</h2>
              <button
                aria-label="닫기"
                onClick={onClose}
                className="text-[#9b91b0] hover:text-[#4a4458] text-2xl leading-none focus-visible:outline-none rounded shrink-0"
              >×</button>
            </div>

            {/* Badges + score */}
            <div className="flex items-center gap-2 mb-5">
              <StatusBadge status={idea.status} />
              <TrackBadge track={idea.sourceTrack} />
              <div className="ml-auto">
                <ScoreBar score={idea.score} />
              </div>
            </div>

            {/* 설명 (pitch) */}
            <Section title="한 줄 요약">
              {idea.description}
            </Section>

            {/* 왜 필요한가 */}
            {idea.purpose && (
              <Section title="왜 필요한가">
                {idea.purpose}
              </Section>
            )}

            {/* 어떻게 동작하나요 */}
            {idea.howItWorks && (
              <Section title="어떻게 동작하나요">
                <div className="whitespace-pre-line">{idea.howItWorks}</div>
              </Section>
            )}

            {/* 추천 기술 스택 */}
            {idea.suggestedStack && (
              <Section title="기술 스택">
                {idea.suggestedStack}
              </Section>
            )}

            {/* 원본 링크 + 날짜 */}
            <div className="flex items-center gap-3 mb-5 text-[13px] text-[#9b91b0]">
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

            {/* 관리자 전용 영역 */}
            {isAdmin && (
              <>
                {idea.scoreMarketFit != null && (
                  <AdminSection title="세부 채점">
                    <div className="space-y-2">
                      {([
                        ['시장 적합성', idea.scoreMarketFit],
                        ['참신성',      idea.scoreNovelty],
                        ['실현 가능성', idea.scoreFeasibility],
                        ['수익화',      idea.scoreMonetization],
                        ['트렌드',      idea.scoreTrend],
                      ] as [string, number | null][]).map(([label, val]) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-[12px] text-[#6b6080] w-20 shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 bg-[#e8e0f0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#7c3aed] transition-all"
                              style={{ width: `${((val ?? 0) / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-[12px] font-bold tabular-nums text-[#2a2433] w-5 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  </AdminSection>
                )}

                {idea.scoreReason && (
                  <AdminSection title="채점 이유">
                    {idea.scoreReason}
                  </AdminSection>
                )}

                {idea.status !== 'REJECTED' && (
                  <div className="space-y-1.5">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={reject.isPending}
                      onClick={() => reject.mutate(idea.id, { onSuccess: onClose })}
                    >
                      {reject.isPending ? '처리 중…' : '거절'}
                    </Button>
                    {reject.isError && (
                      <p role="alert" className="text-xs text-red-500">거절 처리에 실패했습니다. 다시 시도해주세요.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
