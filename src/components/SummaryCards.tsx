import { useIdeaStats } from '@/hooks/useIdeaStats'

const STATUSES: { key: 'PENDING' | 'SCORED' | 'NOTIFIED' | 'REJECTED'; label: string; color: string; bg: string }[] = [
  { key: 'NOTIFIED', label: '알림 완료', color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
  { key: 'SCORED',   label: '채점 완료', color: 'text-[#7c3aed]', bg: 'bg-[rgba(124,58,237,0.07)]' },
  { key: 'PENDING',  label: '대기 중',   color: 'text-[#d97706]', bg: 'bg-[#fffbeb]' },
  { key: 'REJECTED', label: '거절됨',    color: 'text-[#9b91b0]', bg: 'bg-[#f8f6fc]' },
]

export function SummaryCards() {
  const { data, isLoading } = useIdeaStats()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {STATUSES.map(({ key, label, color, bg }) => (
        <div key={key} className={`rounded-xl border border-[#e8e0f0] ${bg} px-4 py-3.5`}>
          <p className="text-[11px] font-bold text-[#9b91b0] uppercase tracking-wider mb-2">{label}</p>
          {isLoading
            ? <div className="h-7 w-12 bg-[#e8e0f0] animate-pulse rounded-md" />
            : <p className={`text-[26px] font-bold tabular-nums leading-none ${color}`}>{data?.[key] ?? 0}</p>
          }
        </div>
      ))}
    </div>
  )
}
