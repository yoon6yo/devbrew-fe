import type { IdeaDto, IdeaStatus, PageResponse } from '@/types'

const STATUSES: { status: IdeaStatus; label: string; color: string }[] = [
  { status: 'NOTIFIED', label: '알림 완료', color: 'text-green-600' },
  { status: 'SCORED',   label: '채점 완료', color: 'text-blue-600' },
  { status: 'PENDING',  label: '대기 중',   color: 'text-amber-600' },
  { status: 'REJECTED', label: '거절됨',    color: 'text-gray-400' },
]

export function SummaryCards({ data, isLoading }: { data: PageResponse<IdeaDto> | undefined; isLoading: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {STATUSES.map(({ status, label, color }) => {
        const count = data?.content.filter((i) => i.status === status).length ?? 0
        return (
          <div key={status} className="rounded border bg-white p-4">
            <p className="text-xs text-[#828c94] mb-1">{label}</p>
            {isLoading
              ? <div className="h-8 w-12 bg-[#e0e0e0] animate-pulse rounded" />
              : <p className={`text-2xl font-bold tabular-nums ${color}`}>{count}</p>}
          </div>
        )
      })}
    </div>
  )
}
