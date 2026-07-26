import type { IdeaDto } from '@/types'

const COLS = ['id', 'title', 'sourceTrack', 'score', 'status', 'createdAt', 'sourceUrl'] as const

export function downloadCsv(ideas: IdeaDto[], filename = 'devbrew-top5.csv'): void {
  const escape = (val: string) => (val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val)
  const rows = [
    COLS.join(','),
    ...ideas.map((idea) => COLS.map((col) => escape(String(idea[col] ?? ''))).join(',')),
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
