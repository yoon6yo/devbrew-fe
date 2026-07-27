import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useIdeas } from '@/hooks/useIdeas'
import { useAdminStats } from '@/hooks/useAdminStats'
import { IdeaCard } from '@/components/IdeaCard'
import { IdeaModal } from '@/components/IdeaModal'
import { SummaryCards } from '@/components/SummaryCards'
import { Pagination } from '@/components/Pagination'
import { ExportButton } from '@/components/ExportButton'
import { PipelineTriggerModal } from '@/components/PipelineTriggerModal'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IdeaStatus } from '@/types'
import type { DailyViewsDto } from '@/api/adminStats'
import { logout } from '@/api/auth'

type TabKey = 'ALL' | 'NOTIFIED_TODAY' | 'NOTIFIED_PAST' | 'UNPUBLISHED' | 'REJECTED'

const TABS: { label: string; key: TabKey }[] = [
  { label: '전체', key: 'ALL' },
  { label: '공시중', key: 'NOTIFIED_TODAY' },
  { label: '공시됐던', key: 'NOTIFIED_PAST' },
  { label: '미공시', key: 'UNPUBLISHED' },
  { label: '거절됨', key: 'REJECTED' },
]

function tabToParams(tab: TabKey): { status?: IdeaStatus; statuses?: IdeaStatus[]; today?: boolean } {
  switch (tab) {
    case 'NOTIFIED_TODAY': return { status: 'NOTIFIED', today: true }
    case 'NOTIFIED_PAST':  return { status: 'NOTIFIED', today: false }
    case 'UNPUBLISHED':    return { statuses: ['PENDING', 'SCORED'] }
    case 'REJECTED':       return { status: 'REJECTED' }
    default:               return {}
  }
}

function PageViewsChart({ data }: { data: DailyViewsDto[] }) {
  if (data.length === 0) {
    return <p className="text-[13px] text-[#9b91b0] py-4 text-center">데이터 없음</p>
  }
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1.5 h-24 pt-2">
      {data.map(d => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <div
            className="w-full rounded bg-[#7c3aed]/50 hover:bg-[#7c3aed]/80 transition-colors"
            style={{ height: `${Math.max((d.count / max) * 72, 3)}px` }}
            title={`${d.date}: ${d.count}회`}
          />
          <span className="text-[10px] text-[#9b91b0] truncate w-full text-center leading-none">
            {d.date.slice(5)}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#e8e0f0] px-4 py-3.5">
      <p className="text-[11px] font-bold text-[#9b91b0] uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-[20px] font-bold text-[#2a2433] tabular-nums leading-none">{value}</p>
      {sub && <p className="text-[11px] text-[#9b91b0] mt-1">{sub}</p>}
    </div>
  )
}

function AdminStatsSection() {
  const { data, isLoading } = useAdminStats()

  if (isLoading || !data) {
    return (
      <div className="mb-6 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#e8e0f0] px-4 py-3.5 animate-pulse h-18" />
          ))}
        </div>
        <div className="bg-white rounded-xl border border-[#e8e0f0] px-4 py-4 animate-pulse h-36" />
      </div>
    )
  }

  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
    n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="오늘 토큰" value={fmt(data.gemini.todayTokens)} />
        <StatCard label="이번 달 토큰" value={fmt(data.gemini.monthTokens)} />
        <StatCard
          label="이번 달 비용"
          value={`$${data.gemini.estimatedMonthlyCostUsd.toFixed(4)}`}
          sub="Flash Lite 기준"
        />
      </div>
      <div className="bg-white rounded-xl border border-[#e8e0f0] px-5 py-4">
        <p className="text-[11px] font-bold text-[#9b91b0] uppercase tracking-wider mb-3">
          일별 접근 수 (최근 7일)
        </p>
        <PageViewsChart data={data.pageViews} />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as TabKey | null) ?? 'ALL'
  const page = Number(searchParams.get('page') ?? 0)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const role = localStorage.getItem('daybrew_role')
  const isAdmin = role === 'ADMIN'

  const [showTriggerModal, setShowTriggerModal] = useState(false)
  const [triggerSuccess, setTriggerSuccess] = useState(false)

  const ideaParams = tabToParams(tab)
  const { data, isLoading, isError, refetch } = useIdeas({ ...ideaParams, page })

  function setTab(key: TabKey) {
    const p = new URLSearchParams()
    if (key !== 'ALL') p.set('tab', key)
    p.set('page', '0')
    setSearchParams(p)
  }

  function setPage(p: number) {
    setSearchParams((prev) => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#4a4458]">
      <header className="sticky top-0 z-10 bg-[#faf9f6]/90 backdrop-blur border-b border-[#e8e0f0] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#6b6080] hover:text-[#7c3aed] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              홈으로
            </Link>
            <span className="text-[#d8d0e8] text-[13px]">|</span>
            <span className="text-[17px] font-bold text-[#2a2433] tracking-tight">대시보드</span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowTriggerModal(true)}
                className={`text-[13px] font-medium px-3.5 py-1.5 rounded-lg border transition-colors ${
                  triggerSuccess
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-[#e8e0f0] bg-white text-[#4a4458] hover:border-[#7c3aed] hover:text-[#7c3aed]'
                }`}
              >
                {triggerSuccess ? '✓ 수집 시작됨' : '스크래핑 실행'}
              </button>
            )}
            <ExportButton />
            <button
              onClick={async () => {
                await logout().catch(() => {})
                localStorage.removeItem('devbrew_token')
                localStorage.removeItem('daybrew_auth')
                localStorage.removeItem('daybrew_role')
                window.location.href = '/'
              }}
              className="text-[13px] text-[#9b91b0] hover:text-[#4a4458] transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        {isAdmin && <AdminStatsSection />}
        <SummaryCards />

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <TabsList className="mb-4">
            {TABS.map(({ label, key }) => (
              <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-[#e8e0f0] bg-white p-4 h-28 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-[#9b91b0] mb-3 text-[14px]">데이터를 불러올 수 없습니다.</p>
            <button
              onClick={() => refetch()}
              className="text-sm text-[#7c3aed] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] rounded"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !isError && data?.content.length === 0 && (
          <p className="text-center py-20 text-[#9b91b0] text-[14px]">아직 아이디어가 없습니다.</p>
        )}

        {!isLoading && !isError && data && data.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.content.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} onClick={() => setSelectedId(idea.id)} />
              ))}
            </div>
            <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        )}
      </main>

      <IdeaModal ideaId={selectedId} onClose={() => setSelectedId(null)} />

      {showTriggerModal && (
        <PipelineTriggerModal
          onClose={() => setShowTriggerModal(false)}
          onStarted={() => {
            setTriggerSuccess(true)
            setTimeout(() => setTriggerSuccess(false), 5000)
          }}
        />
      )}
    </div>
  )
}

export default DashboardPage
