import type { IdeaDto } from '@/types'
import { TrackBadge } from './TrackBadge'
import { ScoreRing } from './ScoreRing'
import { formatDate } from '@/utils/dateFormat'

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-[#b0a4c8] uppercase tracking-widest mb-1.5">
      {children}
    </p>
  )
}

function BulletList({ text, limit = 3, dotColor = '#c4b8d4' }: { text: string; limit?: number; dotColor?: string }) {
  const items = text.split('\n').map(s => s.trim()).filter(Boolean).slice(0, limit)
  return (
    <ul className="space-y-0.5">
      {items.map((item, i) => (
        <li key={i} className="text-[12px] text-[#4a4458] flex gap-1.5 items-start leading-snug">
          <span className="shrink-0 mt-px" style={{ color: dotColor }}>·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

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
  const hasStructured = !!(idea.oneLiner || idea.problems || idea.strengths || idea.risks)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`group cursor-pointer rounded-2xl bg-white p-4 flex flex-col gap-3
                 transition-shadow duration-200 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#7c3aed]/40
                 ${selected
                   ? 'shadow-[0_0_0_2px_#7c3aed] bg-[#faf8ff]'
                   : 'shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:shadow-[0_0_0_1px_#a78bfa,0_4px_20px_rgba(124,58,237,0.12)]'
                 }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
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
          <h3 className="text-[15px] font-semibold text-[#18142a] line-clamp-2 leading-snug tracking-tight">
            {idea.title}
          </h3>
        </div>
        <div className="shrink-0">
          <ScoreRing score={idea.score} size={40} />
        </div>
      </div>

      {/* One-liner */}
      {idea.oneLiner ? (
        <p className="text-[13px] text-[#7c3aed] font-medium leading-snug -mt-1">
          {idea.oneLiner}
        </p>
      ) : !hasStructured && idea.description ? (
        <p className="text-[13px] text-[#9b91b0] line-clamp-2 leading-relaxed -mt-1">
          {idea.description}
        </p>
      ) : null}

      {/* Problems */}
      {idea.problems && (
        <div className="bg-[#f8f6ff] rounded-xl px-3 py-2.5">
          <p className="text-[10px] font-semibold text-[#a78bfa] uppercase tracking-widest mb-1.5">해결하는 문제</p>
          <BulletList text={idea.problems} dotColor="#c4b8d4" />
        </div>
      )}

      {/* Strengths + Risks */}
      {(idea.strengths || idea.risks) && (
        <div className="grid grid-cols-2 gap-2.5">
          {idea.strengths && (
            <div className="bg-[#f5f3ff] rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-semibold text-[#5b21b6] uppercase tracking-widest mb-1.5">강점</p>
              <BulletList text={idea.strengths} limit={2} dotColor="#a78bfa" />
            </div>
          )}
          {idea.risks && (
            <div className="bg-[#f3f0ec] rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-semibold text-[#78716c] uppercase tracking-widest mb-1.5">리스크</p>
              <BulletList text={idea.risks} limit={2} dotColor="#c4b8d4" />
            </div>
          )}
        </div>
      )}

      {/* Revenue model */}
      {idea.revenueModel && (
        <p className="text-[12px] text-[#5b21b6] bg-[#f5f3ff] rounded-lg px-2.5 py-1.5 leading-snug font-medium">
          {idea.revenueModel}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-2.5 border-t border-[#ede9fe]">
        <span className="text-[11px] text-[#c4b8d4] tracking-wide">{formatDate(idea.createdAt)}</span>
      </div>
    </article>
  )
}
