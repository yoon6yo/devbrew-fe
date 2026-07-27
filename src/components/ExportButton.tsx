import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getTopIdeas } from '@/api/ideas'
import { downloadJson } from '@/utils/exportJson'
import { downloadCsv } from '@/utils/exportCsv'

type Format = 'JSON' | 'CSV'
type State = 'idle' | 'loading' | 'error'

export function ExportButton() {
  const [state, setState] = useState<State>('idle')
  const [format, setFormat] = useState<Format>('JSON')

  async function handleExport() {
    setState('loading')
    try {
      const ideas = await getTopIdeas(5)
      format === 'JSON' ? downloadJson(ideas) : downloadCsv(ideas)
      setState('idle')
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as Format)}
        aria-label="내보내기 형식"
        disabled={state === 'loading'}
        className="text-sm border rounded border-[#e0e0e0] px-2 py-1.5 text-[#424242] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a1ff] disabled:opacity-50"
      >
        <option>JSON</option>
        <option>CSV</option>
      </select>
      <Button variant="outline" size="sm" onClick={handleExport} disabled={state === 'loading'}>
        {state === 'loading' && '준비 중…'}
        {state === 'error' && '오류 발생'}
        {state === 'idle' && 'Top 5 Export'}
      </Button>
    </div>
  )
}
