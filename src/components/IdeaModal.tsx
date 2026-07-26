import { useIdeaDetail } from '@/hooks/useIdeaDetail'
import { useRejectIdea } from '@/hooks/useRejectIdea'
import { StatusBadge } from './StatusBadge'
import { TrackBadge } from './TrackBadge'
import { ScoreBar } from './ScoreBar'
import { formatDate } from '@/utils/dateFormat'
import { Button } from '@/components/ui/button'

export function IdeaModal({ ideaId, onClose }: { ideaId: number | null; onClose: () => void }) {
  const { data: idea, isLoading } = useIdeaDetail(ideaId)
  const reject = useRejectIdea()

  if (ideaId === null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-zinc-100 animate-pulse rounded" />)}
          </div>
        ) : idea ? (
          <>
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-zinc-900 flex-1">{idea.title}</h2>
              <button aria-label="닫기" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 text-2xl leading-none">×</button>
            </div>
            <div className="flex gap-2 mb-4">
              <StatusBadge status={idea.status} />
              <TrackBadge track={idea.sourceTrack} />
            </div>
            <div className="mb-4">
              <p className="text-xs text-zinc-500 mb-1">점수</p>
              <ScoreBar score={idea.score} />
            </div>
            {idea.scoreReason && (
              <div className="mb-4 p-3 bg-zinc-50 rounded-lg">
                <p className="text-xs text-zinc-500 mb-1">채점 이유</p>
                <p className="text-sm text-zinc-700 leading-relaxed">{idea.scoreReason}</p>
              </div>
            )}
            <div className="mb-4">
              <p className="text-xs text-zinc-500 mb-1">설명</p>
              <p className="text-sm text-zinc-700 leading-relaxed">{idea.description}</p>
            </div>
            <a href={idea.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all block mb-4">
              {idea.sourceUrl}
            </a>
            <p className="text-xs text-zinc-400 mb-4">{formatDate(idea.createdAt)}</p>
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
