import { useState } from 'react'
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
      if (format === 'JSON') { downloadJson(ideas) } else { downloadCsv(ideas) }
      setState('idle')
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <div className="flex items-center rounded-lg border border-[#e8e0f0] bg-white overflow-hidden">
      {(['JSON', 'CSV'] as Format[]).map(f => (
        <button
          key={f}
          onClick={() => setFormat(f)}
          disabled={state === 'loading'}
          className={`px-2.5 py-1.5 text-[12px] font-bold transition-colors disabled:opacity-50 ${
            format === f ? 'bg-[#7c3aed] text-white' : 'text-[#6b6080] hover:text-[#7c3aed]'
          }`}
        >
          {f}
        </button>
      ))}
      <div className="w-px h-5 bg-[#e8e0f0]" />
      <button
        onClick={handleExport}
        disabled={state === 'loading'}
        className="px-3 py-1.5 text-[12px] font-medium text-[#4a4458] hover:text-[#7c3aed] transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {state === 'loading' ? '준비 중…' : state === 'error' ? '오류 발생' : 'Top 5 내보내기 ↓'}
      </button>
    </div>
  )
}
