import { useIdeaStats } from '@/hooks/useIdeaStats'

const STATUSES: { key: 'PENDING' | 'SCORED' | 'NOTIFIED' | 'REJECTED'; label: string; color: string }[] = [
  { key: 'NOTIFIED', label: '알림 완료', color: 'text-green-600' },
  { key: 'SCORED',   label: '채점 완료', color: 'text-blue-600' },
  { key: 'PENDING',  label: '대기 중',   color: 'text-amber-600' },
  { key: 'REJECTED', label: '거절됨',    color: 'text-gray-400' },
]

export function SummaryCards() {
  const { data, isLoading } = useIdeaStats()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {STATUSES.map(({ key, label, color }) => (
        <div key={key} className="rounded border bg-white p-4">
          <p className="text-xs text-[#828c94] mb-1">{label}</p>
          {isLoading
            ? <div className="h-8 w-12 bg-[#e0e0e0] animate-pulse rounded" />
            : <p className={`text-2xl font-bold tabular-nums ${color}`}>{data?.[key] ?? 0}</p>}
        </div>
      ))}
    </div>
  )
}
