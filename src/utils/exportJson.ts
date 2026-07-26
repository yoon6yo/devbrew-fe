import type { IdeaDto } from '@/types'

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadJson(ideas: IdeaDto[], filename = 'devbrew-top5.json'): void {
  const blob = new Blob([JSON.stringify(ideas, null, 2)], { type: 'application/json' })
  triggerDownload(blob, filename)
}
