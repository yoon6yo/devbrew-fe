import { useState } from 'react'
import { triggerPipeline } from '@/api/adminStats'
import type { SourceTrack } from '@/api/adminStats'

interface Props {
  onClose: () => void
  onStarted: () => void
}

const SOURCES: { key: SourceTrack; label: string; desc: string }[] = [
  { key: 'SAAS',   label: 'Reddit (SaaS)',  desc: 'r/SaaS, r/entrepreneur, r/startups' },
  { key: 'GITHUB', label: 'GitHub 트렌드',  desc: '인기 오픈소스 저장소 탐색' },
  { key: 'VIRAL',  label: '바이럴 시드',    desc: '트렌드 키워드 기반 아이디어' },
]

export function PipelineTriggerModal({ onClose, onStarted }: Props) {
  const [selected, setSelected] = useState<Set<SourceTrack>>(
    new Set(['SAAS', 'GITHUB', 'VIRAL'])
  )
  const [minScore, setMinScore] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  function toggle(key: SourceTrack) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) { if (next.size > 1) next.delete(key) }
      else next.add(key)
      return next
    })
  }

  async function handleRun() {
    setLoading(true)
    setError(false)
    try {
      await triggerPipeline({
        sources: [...selected],
        minScore,
      })
      onStarted()
      onClose()
    } catch {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-[#e8e0f0] shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-bold text-[#2a2433]">스크래핑 옵션</h2>
          <button
            onClick={onClose}
            className="text-[#9b91b0] hover:text-[#4a4458] transition-colors text-[18px] leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          {/* Source selector */}
          <div>
            <p className="text-[11px] font-bold text-[#9b91b0] uppercase tracking-wider mb-2.5">수집 소스</p>
            <div className="space-y-2">
              {SOURCES.map(({ key, label, desc }) => (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selected.has(key)
                      ? 'border-[#7c3aed] bg-[rgba(124,58,237,0.05)]'
                      : 'border-[#e8e0f0] hover:border-[#d0c8e0]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(key)}
                    onChange={() => toggle(key)}
                    className="mt-0.5 accent-[#7c3aed]"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-[#2a2433]">{label}</p>
                    <p className="text-[12px] text-[#9b91b0]">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Min score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-[#9b91b0] uppercase tracking-wider">알림 최소 점수</p>
              <span className="text-[15px] font-bold text-[#7c3aed] tabular-nums">{minScore}점</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full accent-[#7c3aed]"
            />
            <div className="flex justify-between text-[11px] text-[#9b91b0] mt-1">
              <span>1 (느슨하게)</span>
              <span>10 (엄격하게)</span>
            </div>
            <p className="text-[12px] text-[#9b91b0] mt-1.5">
              이 점수 이상인 아이디어만 공시됩니다.
            </p>
          </div>

          {error && (
            <p className="text-[12px] text-red-600 bg-red-50 rounded-lg px-3 py-2">
              파이프라인 실행에 실패했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          )}

          <button
            onClick={handleRun}
            disabled={loading || selected.size === 0}
            className="w-full py-3 rounded-xl bg-[#7c3aed] text-white text-[14px] font-bold hover:bg-[#6d28d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '수집 시작 중…' : `${[...selected].length}개 소스 스크래핑 실행`}
          </button>
        </div>
      </div>
    </div>
  )
}
