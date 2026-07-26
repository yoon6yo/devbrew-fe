import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getTopIdeas } from '@/api/ideas'
import { downloadJson } from '@/utils/exportJson'
import { downloadCsv } from '@/utils/exportCsv'

type Format = 'JSON' | 'CSV'

export function ExportButton() {
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState<Format>('JSON')

  async function handleExport() {
    setLoading(true)
    try {
      const ideas = await getTopIdeas(5)
      format === 'JSON' ? downloadJson(ideas) : downloadCsv(ideas)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select value={format} onChange={(e) => setFormat(e.target.value as Format)}
        className="text-sm border rounded border-[#e0e0e0] px-2 py-1.5 text-[#424242] bg-white">
        <option>JSON</option>
        <option>CSV</option>
      </select>
      <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
        {loading ? '준비 중…' : 'Top 5 Export'}
      </Button>
    </div>
  )
}
