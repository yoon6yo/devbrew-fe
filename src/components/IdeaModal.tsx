import { useEffect } from 'react'
import { useIdeaDetail } from '@/hooks/useIdeaDetail'
import { useRejectIdea } from '@/hooks/useRejectIdea'
import { StatusBadge } from './StatusBadge'
import { TrackBadge } from './TrackBadge'
import { ScoreBar } from './ScoreBar'
import { formatDate } from '@/utils/dateFormat'
import { Button } from '@/components/ui/button'

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
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-[#e0e0e0] animate-pulse rounded" />)}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-[#828c94] text-sm mb-3">아이디어 정보를 불러올 수 없습니다.</p>
            <button onClick={onClose} className="text-sm text-[#00a1ff] hover:underline">닫기</button>
          </div>
        ) : idea ? (
          <>
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 id="modal-title" className="text-lg font-bold text-[#2f3438] flex-1">{idea.title}</h2>
              <button aria-label="닫기" onClick={onClose} className="text-[#828c94] hover:text-[#424242] text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0e0e0] rounded">×</button>
            </div>
            <div className="flex gap-2 mb-4">
              <StatusBadge status={idea.status} />
              <TrackBadge track={idea.sourceTrack} />
            </div>
            <div className="mb-4">
              <p className="text-xs text-[#828c94] mb-1">점수</p>
              <ScoreBar score={idea.score} />
            </div>
            {idea.scoreReason && (
              <div className="mb-4 p-3 bg-[#f8f8f8] rounded">
                <p className="text-xs text-[#828c94] mb-1">채점 이유</p>
                <p className="text-sm text-[#424242] leading-relaxed">{idea.scoreReason}</p>
              </div>
            )}
            <div className="mb-4">
              <p className="text-xs text-[#828c94] mb-1">설명</p>
              <p className="text-sm text-[#424242] leading-relaxed">{idea.description}</p>
            </div>
            <a href={idea.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-[#00a1ff] hover:underline break-all block mb-4">
              {idea.sourceUrl}
            </a>
            <p className="text-xs text-[#828c94] mb-4">{formatDate(idea.createdAt)}</p>
            {idea.status !== 'REJECTED' && (
              <Button variant="destructive" size="sm" disabled={reject.isPending}
                onClick={() => reject.mutate(idea.id, { onSuccess: onClose })}>
                {reject.isPending ? '처리 중…' : '거절'}
              </Button>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
