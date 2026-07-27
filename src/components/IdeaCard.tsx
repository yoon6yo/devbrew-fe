import type { IdeaDto } from '@/types'
import { StatusBadge } from './StatusBadge'
import { TrackBadge } from './TrackBadge'
import { formatDate } from '@/utils/dateFormat'

function scoreStyle(score: number): { color: string; track: string; label?: string } {
  if (score >= 9) return { color: '#f59e0b', track: '#fef3c7', label: '★' }
  if (score >= 8) return { color: '#10b981', track: '#d1fae5', label: '↑' }
  if (score >= 7) return { color: '#3b82f6', track: '#dbeafe', label: '↑' }
  if (score >= 5) return { color: '#7c3aed', track: '#ede9fe' }
  return { color: '#9b91b0', track: '#f0ebf8' }
}

function ScoreRing({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[12px] text-[#c4b8d4] font-medium">미채점</span>
  const { color, track, label } = scoreStyle(score)
  const pct = (score / 10) * 100
  const r = 16
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke={track} strokeWidth="3.5" />
        <circle
          cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
      </svg>
      <div className="flex flex-col items-center leading-none gap-0.5">
        <span className="text-[20px] font-bold tabular-nums" style={{ color }}>{score}</span>
        {label && <span className="text-[10px] font-bold" style={{ color }}>{label}</span>}
      </div>
    </div>
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
      <div className="flex items-center justify-between pt-1 border-t border-[#f0ebf8]">
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
