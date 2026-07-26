function barColor(score: number): string {
  if (score >= 8) return 'bg-green-500'
  if (score >= 6) return 'bg-[#7c3aed]'
  return 'bg-[#e8e0f0]'
}

export function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[#8b8398] text-sm">—</span>
  const pct = Math.min(100, (score / 10) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#e8e0f0] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor(score)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold tabular-nums">{score}</span>
    </div>
  )
}
