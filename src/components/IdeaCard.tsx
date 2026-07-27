import type { IdeaDto } from '@/types'
import { StatusBadge } from './StatusBadge'
import { TrackBadge } from './TrackBadge'
import { ScoreRing } from './ScoreRing'
import { formatDate } from '@/utils/dateFormat'

export function IdeaCard({
  idea,
  onClick,
  selected,
  onToggle,
}: {
  idea: IdeaDto
  onClick: () => void
  selected?: boolean
  onToggle?: (id: number) => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`group cursor-pointer rounded-2xl border bg-white p-5
                 hover:border-[#c4b5fd] hover:shadow-[0_4px_20px_rgba(124,58,237,0.10)]
                 transition-all duration-200 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#7c3aed]/40 flex flex-col gap-3
                 ${selected ? 'border-[#7c3aed] bg-[#faf8ff]' : 'border-[#e8e0f0]'}`}
    >
      {/* Top: track badge + score ring (+ optional checkbox) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onToggle && (
            <input
              type="checkbox"
              checked={selected ?? false}
              onChange={() => onToggle(idea.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded border-[#c4b8d4] accent-[#7c3aed] cursor-pointer shrink-0"
            />
          )}
          <TrackBadge track={idea.sourceTrack} />
        </div>
        <ScoreRing score={idea.score} />
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-bold text-[#2a2433] line-clamp-2 leading-snug flex-1">
        {idea.title}
      </h3>

      {/* Description preview */}
      {idea.description && (
        <p className="text-[12px] text-[#6b6080] line-clamp-2 leading-relaxed">
          {idea.description}
        </p>
      )}

      {/* Bottom: status + date + cta */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <StatusBadge status={idea.status} />
          <span className="text-[11px] text-[#c4b8d4]">{formatDate(idea.createdAt)}</span>
        </div>
        <span className="text-[12px] text-[#c4b8d4] group-hover:text-[#7c3aed] transition-colors font-medium select-none">
          자세히 →
        </span>
      </div>
    </article>
  )
}
