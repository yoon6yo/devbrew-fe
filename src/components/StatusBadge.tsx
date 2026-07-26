import type { IdeaStatus } from '@/types'

const colorMap: Record<IdeaStatus, string> = {
  NOTIFIED: 'bg-green-100 text-green-700 border-green-200',
  SCORED:   'bg-blue-100 text-blue-700 border-blue-200',
  PENDING:  'bg-amber-100 text-amber-700 border-amber-200',
  REJECTED: 'bg-gray-100 text-gray-500 border-gray-200',
}

export function StatusBadge({ status }: { status: IdeaStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorMap[status]}`}>
      {status}
    </span>
  )
}
