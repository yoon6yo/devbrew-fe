export function scoreStyle(score: number): { color: string; track: string } {
  if (score >= 9) return { color: '#f59e0b', track: 'rgba(245,158,11,0.12)' }
  if (score >= 8) return { color: '#10b981', track: 'rgba(16,185,129,0.12)' }
  if (score >= 7) return { color: '#3b82f6', track: 'rgba(59,130,246,0.12)' }
  if (score >= 5) return { color: '#7c3aed', track: 'rgba(124,58,237,0.12)' }
  return { color: '#9b91b0', track: 'rgba(155,145,176,0.12)' }
}

export function ScoreRing({ score, size = 40 }: { score: number | null; size?: number }) {
  if (score === null) return <span className="text-[12px] text-[#c4b8d4] font-medium">미채점</span>
  const { color, track } = scoreStyle(score)
  const r = (size / 2) - 4
  const circ = 2 * Math.PI * r
  const dash = (score / 10) * circ
  const fontSize = size >= 50 ? 24 : 20
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
      <span className="font-bold tabular-nums" style={{ color, fontSize }}>{score}</span>
    </div>
  )
}
