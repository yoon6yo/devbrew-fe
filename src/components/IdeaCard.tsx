import type { IdeaDto } from '@/types'
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
      className={`group cursor-pointer rounded-2xl border bg-white px-5 pt-5 pb-4
                 hover:border-[#a78bfa] hover:shadow-[0_8px_40px_rgba(124,58,237,0.09)]
                 transition-all duration-300 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#7c3aed]/40 flex flex-col gap-3.5
                 ${selected ? 'border-[#7c3aed] bg-[#faf8ff]' : 'border-[#e8e0f0]'}`}
    >
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

      <h3 className="text-[14.5px] font-semibold text-[#18142a] line-clamp-2 leading-snug tracking-tight">
        {idea.title}
      </h3>

      {idea.description && (
        <p className="text-[12.5px] text-[#7a718e] line-clamp-2 leading-relaxed">
          {idea.description}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-[#f0ebf8]">
        <span className="text-[11px] text-[#c4b8d4] tracking-wide">{formatDate(idea.createdAt)}</span>
      </div>
    </article>
  )
}
