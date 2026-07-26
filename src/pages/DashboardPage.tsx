import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useIdeas } from '@/hooks/useIdeas'
import { useAdminStats } from '@/hooks/useAdminStats'
import { IdeaCard } from '@/components/IdeaCard'
import { IdeaModal } from '@/components/IdeaModal'
import { SummaryCards } from '@/components/SummaryCards'
import { Pagination } from '@/components/Pagination'
import { ExportButton } from '@/components/ExportButton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IdeaStatus } from '@/types'
import type { DailyViewsDto } from '@/api/adminStats'

const TABS: { label: string; value: IdeaStatus | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '알림 완료', value: 'NOTIFIED' },
  { label: '채점 완료', value: 'SCORED' },
  { label: '대기 중', value: 'PENDING' },
  { label: '거절됨', value: 'REJECTED' },
]

function PageViewsChart({ data }: { data: DailyViewsDto[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1 h-14">
      {data.map(d => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <div
            className="w-full rounded-sm bg-[#7c3aed]/60 transition-all"
            style={{ height: `${Math.max((d.count / max) * 44, 2)}px` }}
          />
          <span className="text-[10px] text-[#828c94] truncate w-full text-center">{d.date.slice(5)}</span>
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-3">
      <p className="text-[12px] text-[#828c94] mb-1">{label}</p>
      <p className="text-[18px] font-bold text-[#2f3438] tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-[#828c94] mt-0.5">{sub}</p>}
    </div>
  )
}

function AdminStatsSection() {
  const { data, isLoading } = useAdminStats()

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-3 animate-pulse h-16" />
        ))}
      </div>
    )
  }

  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
    n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="오늘 Gemini 토큰"
          value={fmt(data.gemini.todayTokens)}
        />
        <StatCard
          label="이번 달 토큰"
          value={fmt(data.gemini.monthTokens)}
        />
        <StatCard
          label="이번 달 추정 비용"
          value={`$${data.gemini.estimatedMonthlyCostUsd.toFixed(4)}`}
          sub="Flash Lite 기준"
        />
      </div>
      {data.pageViews.length > 0 && (
        <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-3">
          <p className="text-[12px] text-[#828c94] mb-3">일별 사용자 접근 (최근 7일)</p>
          <PageViewsChart data={data.pageViews} />
        </div>
      )}
    </div>
  )
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = (searchParams.get('status') as IdeaStatus | null) ?? undefined
  const page = Number(searchParams.get('page') ?? 0)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const role = localStorage.getItem('daybrew_role')
  const isAdmin = role === 'ADMIN'

  const { data, isLoading, isError, refetch } = useIdeas({ status, page })

  function setStatus(value: IdeaStatus | 'ALL') {
    const p = new URLSearchParams()
    if (value !== 'ALL') p.set('status', value)
    p.set('page', '0')
    setSearchParams(p)
  }

  function setPage(p: number) {
    setSearchParams((prev) => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#2f3438]">DevBrew</h1>
        <div className="flex items-center gap-4">
          <ExportButton />
          <button
            onClick={() => {
              localStorage.removeItem('devbrew_token')
              localStorage.removeItem('daybrew_auth')
              localStorage.removeItem('daybrew_role')
              window.location.href = '/login'
            }}
            className="text-[14px] text-[#828c94] hover:text-[#424242] transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6">
        {isAdmin && <AdminStatsSection />}
        <SummaryCards data={data} isLoading={isLoading} />
        <Tabs value={status ?? 'ALL'} onValueChange={(v) => setStatus(v as IdeaStatus | 'ALL')}>
          <TabsList className="mb-4">
            {TABS.map(({ label, value }) => (
              <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="rounded border border-[#e0e0e0] bg-[#e0e0e0] p-4 h-28 animate-pulse" />)}
          </div>
        )}
        {isError && (
          <div className="text-center py-20">
            <p className="text-[#828c94] mb-3">데이터를 불러올 수 없습니다.</p>
            <button onClick={() => refetch()} className="text-sm text-[#00a1ff] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a1ff] rounded">다시 시도</button>
          </div>
        )}
        {!isLoading && !isError && data?.content.length === 0 && (
          <p className="text-center py-20 text-[#828c94] text-sm">아직 아이디어가 없습니다.</p>
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
    </div>
  )
}

export default DashboardPage
