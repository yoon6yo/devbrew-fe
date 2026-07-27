export function scoreStyle(score: number): { color: string; track: string; label?: string } {
  if (score >= 9) return { color: '#f59e0b', track: '#fef3c7', label: '★' }
  if (score >= 8) return { color: '#10b981', track: '#d1fae5', label: '↑' }
  if (score >= 7) return { color: '#3b82f6', track: '#dbeafe', label: '↑' }
  if (score >= 5) return { color: '#7c3aed', track: '#ede9fe' }
  return { color: '#9b91b0', track: '#f0ebf8' }
}

export function ScoreRing({ score, size = 40 }: { score: number | null; size?: number }) {
  if (score === null) return <span className="text-[12px] text-[#c4b8d4] font-medium">미채점</span>
  const { color, track, label } = scoreStyle(score)
  const r = (size / 2) - 4
  const circ = 2 * Math.PI * r
  const dash = ((score / 10) * circ)
  const fontSize = size >= 50 ? 24 : 20
  const labelSize = size >= 50 ? 11 : 10
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth="3.5" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
      </svg>
      <div className="flex flex-col items-center leading-none gap-0.5">
        <span className="font-bold tabular-nums" style={{ color, fontSize }}>{score}</span>
        {label && <span className="font-bold" style={{ color, fontSize: labelSize }}>{label}</span>}
      </div>
    </div>
  )
}
