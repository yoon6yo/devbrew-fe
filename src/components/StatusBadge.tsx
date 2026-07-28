import type { IdeaStatus } from '@/types'

const colorMap: Record<IdeaStatus, string> = {
  FEATURED: 'bg-amber-100 text-amber-700 border-amber-200',
  NOTIFIED: 'bg-green-100 text-green-700 border-green-200',
  SCORED:   'bg-blue-100 text-blue-700 border-blue-200',
  PENDING:  'bg-[#f0ebf8] text-[#7c3aed] border-[rgba(124,58,237,0.2)]',
  REJECTED: 'bg-gray-100 text-gray-500 border-gray-200',
}

const labelMap: Record<IdeaStatus, string> = {
  FEATURED: '게시됨',
  NOTIFIED: '공시됨',
  SCORED:   '채점 완료',
  PENDING:  '대기 중',
  REJECTED: '거절됨',
}

export function StatusBadge({ status }: { status: IdeaStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  )
}
