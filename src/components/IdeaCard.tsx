import type { IdeaDto } from '@/types'
import { StatusBadge } from './StatusBadge'
import { TrackBadge } from './TrackBadge'
import { ScoreBar } from './ScoreBar'
import { formatDate } from '@/utils/dateFormat'

export function IdeaCard({ idea, onClick }: { idea: IdeaDto; onClick: () => void }) {
  return (
    <article
      role="article"
      onClick={onClick}
      className="cursor-pointer rounded border border-[#e0e0e0] bg-white p-4 hover:border-[#c8c8c8] hover:shadow-[0_2px_5px_rgba(63,71,77,0.15)] transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[#2f3438] line-clamp-2 flex-1">{idea.title}</h3>
        <TrackBadge track={idea.sourceTrack} />
      </div>
      <div className="flex items-center justify-between">
        <ScoreBar score={idea.score} />
        <StatusBadge status={idea.status} />
      </div>
      <p className="mt-2 text-xs text-[#828c94]">{formatDate(idea.createdAt)}</p>
    </article>
  )
}
