function barColor(score: number): string {
  if (score >= 8) return 'bg-green-500'
  if (score >= 6) return 'bg-[#00a1ff]'
  return 'bg-[#e0e0e0]'
}

export function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[#828c94] text-sm">—</span>
  const pct = Math.min(100, (score / 10) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor(score)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold tabular-nums">{score}</span>
    </div>
  )
}
