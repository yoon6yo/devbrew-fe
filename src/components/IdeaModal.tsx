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
    <div className="mb-4 p-3 bg-[#f8f8f8] rounded">
      <p className="text-xs text-[#828c94] mb-1.5 font-bold uppercase tracking-wide">{title}</p>
      <div className="text-[15px] text-[#424242] leading-relaxed">{children}</div>
    </div>
  )
}

export function IdeaModal({ ideaId, onClose }: { ideaId: number | null; onClose: () => void }) {
  const { data: idea, isLoading, isError } = useIdeaDetail(ideaId)
  const reject = useRejectIdea()

  useEffect(() => {
    if (ideaId === null) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [ideaId, onClose])

  if (ideaId === null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded w-full max-w-lg mx-4 p-6 shadow-[0_2px_5px_rgba(63,71,77,0.15)] max-h-[90vh] overflow-y-auto"
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
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 id="modal-title" className="text-[16px] font-bold text-[#2f3438] leading-6 flex-1">{idea.title}</h2>
              <button
                aria-label="닫기"
                onClick={onClose}
                className="text-[#828c94] hover:text-[#424242] text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0e0e0] rounded shrink-0"
              >×</button>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-5">
              <StatusBadge status={idea.status} />
              <TrackBadge track={idea.sourceTrack} />
            </div>

            {/* 사용 목적 */}
            {idea.purpose && (
              <Section title="사용 목적">
                {idea.purpose}
              </Section>
            )}

            {/* 어떻게 동작하나요 */}
            {idea.howItWorks && (
              <Section title="어떻게 동작하나요">
                <div className="whitespace-pre-line">{idea.howItWorks}</div>
              </Section>
            )}

            {/* 설명 */}
            <Section title="설명">
              {idea.description}
            </Section>

            {/* 추천 기술 스택 */}
            {idea.suggestedStack && (
              <Section title="추천 기술 스택">
                {idea.suggestedStack}
              </Section>
            )}

            {/* 점수 */}
            <div className="mb-4">
              <p className="text-xs text-[#828c94] mb-1.5">점수</p>
              <ScoreBar score={idea.score} />
            </div>

            {/* 채점 이유 */}
            {idea.scoreReason && (
              <Section title="채점 이유">
                {idea.scoreReason}
              </Section>
            )}

            {/* 원본 링크 */}
            {idea.sourceUrl && (
              <a
                href={idea.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[#00a1ff] hover:underline break-all block mb-4"
              >
                {idea.sourceUrl}
              </a>
            )}

            <p className="text-[14px] text-[#828c94] mb-4">{formatDate(idea.createdAt)}</p>

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
          </>
        ) : null}
      </div>
    </div>
  )
}
