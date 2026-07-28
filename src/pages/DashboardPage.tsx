import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useIdeas } from '@/hooks/useIdeas'
import { useAdminStats } from '@/hooks/useAdminStats'
import { useIdeaStats } from '@/hooks/useIdeaStats'
import { IdeaCard } from '@/components/IdeaCard'
import { IdeaModal } from '@/components/IdeaModal'
import { Pagination } from '@/components/Pagination'
import { ExportButton } from '@/components/ExportButton'
import { PipelineTriggerModal } from '@/components/PipelineTriggerModal'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IdeaStatus } from '@/types'
import { notifyIdea, rejectIdea, restoreIdea, featureIdea } from '@/api/ideas'
import { logout } from '@/api/auth'

type TabKey = 'ALL' | 'PENDING' | 'SCORED' | 'NOTIFIED' | 'FEATURED' | 'REJECTED'

function tabToParams(tab: TabKey): { status?: IdeaStatus; statuses?: IdeaStatus[] } {
  switch (tab) {
    case 'PENDING':  return { status: 'PENDING' }
    case 'SCORED':   return { status: 'SCORED' }
    case 'NOTIFIED': return { status: 'NOTIFIED' }
    case 'FEATURED': return { status: 'FEATURED' }
    case 'REJECTED': return { status: 'REJECTED' }
    default:         return {}
  }
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#e8e0f0] px-4 py-3.5 animate-pulse h-20" />
          ))}
        </div>
      </div>
    )
  }

  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
    n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="오늘 방문"
          value={fmt(data.pageViews.find(d => d.date === new Date().toISOString().slice(0, 10))?.count ?? 0)}
          sub={`7일 합계 ${fmt(data.pageViews.reduce((s, d) => s + d.count, 0))}회`}
        />
        <StatCard label="이번 달 토큰" value={fmt(data.gemini.monthTokens)} />
        <StatCard
          label="이번 달 비용"
          value={`$${data.gemini.estimatedMonthlyCostUsd.toFixed(4)}`}
          sub="Flash 기준"
        />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = (searchParams.get('tab') as TabKey | null) ?? 'ALL'
  const page = Number(searchParams.get('page') ?? 0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [bulkPending, setBulkPending] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const queryClient = useQueryClient()
  const role = localStorage.getItem('daybrew_role')
  const isAdmin = role === 'ADMIN'

  const [showTriggerModal, setShowTriggerModal] = useState(false)
  const [triggerSuccess, setTriggerSuccess] = useState(false)

  const ideaParams = tabToParams(tab)
  const { data, isLoading, isError, refetch } = useIdeas({ ...ideaParams, page })
  const { data: stats } = useIdeaStats()

  const total = stats ? (stats.PENDING + stats.SCORED + stats.NOTIFIED + (stats.FEATURED ?? 0) + stats.REJECTED) : null
  const TABS: { label: string; key: TabKey; count: number | null }[] = [
    { label: '전체',    key: 'ALL',      count: total },
    { label: '대기중',  key: 'PENDING',  count: stats?.PENDING ?? null },
    { label: '채점완료', key: 'SCORED',  count: stats?.SCORED ?? null },
    { label: '공시됨',  key: 'NOTIFIED', count: stats?.NOTIFIED ?? null },
    { label: '게시됨', key: 'FEATURED', count: stats?.FEATURED ?? null },
    { label: '거절됨',  key: 'REJECTED', count: stats?.REJECTED ?? null },
  ]

  function setTab(key: TabKey) {
    const p = new URLSearchParams()
    if (key !== 'ALL') p.set('tab', key)
    p.set('page', '0')
    setSelectedIds(new Set())
    setIsEditMode(false)
    setSearchParams(p)
  }

  function setPage(p: number) {
    setSearchParams((prev) => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    const ids = data?.content.map(i => i.id) ?? []
    setSelectedIds(prev => prev.size === ids.length ? new Set() : new Set(ids))
  }

  async function handleBulkNotify() {
    setBulkPending(true)
    await Promise.allSettled([...selectedIds].map(id => notifyIdea(id)))
    setSelectedIds(new Set())
    refetch()
    queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    setBulkPending(false)
  }

  async function handleBulkReject() {
    setBulkPending(true)
    await Promise.allSettled([...selectedIds].map(id => rejectIdea(id)))
    setSelectedIds(new Set())
    refetch()
    queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    setBulkPending(false)
  }

  async function handleBulkFeature() {
    setBulkPending(true)
    await Promise.allSettled([...selectedIds].map(id => featureIdea(id)))
    setSelectedIds(new Set())
    refetch()
    queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    setBulkPending(false)
  }

  async function handleBulkRestore() {
    setBulkPending(true)
    await Promise.allSettled([...selectedIds].map(id => restoreIdea(id)))
    setSelectedIds(new Set())
    refetch()
    queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    setBulkPending(false)
  }

  const canBulkSelect = isAdmin && (tab === 'SCORED' || tab === 'PENDING' || tab === 'REJECTED' || tab === 'NOTIFIED' || tab === 'FEATURED')

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#4a4458]">
      <header className="sticky top-0 z-10 bg-[#faf9f6]/90 backdrop-blur border-b border-[#e8e0f0] px-4 sm:px-6 py-3.5">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {isAdmin && <AdminStatsSection />}

        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="overflow-x-auto flex-1 min-w-0">
            <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
              <TabsList>
                {TABS.map(({ label, key, count }) => (
                  <TabsTrigger key={key} value={key}>
                    {label}
                    {count !== null && (
                      <span className="ml-1.5 text-[11px] opacity-60 tabular-nums">({count})</span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          {canBulkSelect && (
            <button
              onClick={() => { setIsEditMode(v => !v); setSelectedIds(new Set()) }}
              className={`text-[13px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                isEditMode
                  ? 'border-[#7c3aed] text-[#7c3aed] bg-[rgba(124,58,237,0.06)]'
                  : 'border-[#e8e0f0] text-[#9b91b0] hover:border-[#7c3aed] hover:text-[#7c3aed]'
              }`}
            >
              {isEditMode ? '완료' : '편집'}
            </button>
          )}
        </div>

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
            {isEditMode && canBulkSelect && selectedIds.size > 0 && (
              <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-white border border-[#7c3aed]/30 rounded-xl shadow-sm">
                <span className="text-[13px] font-medium text-[#2a2433]">{selectedIds.size}개 선택됨</span>
                <div className="flex-1" />
                {(tab === 'SCORED' || tab === 'NOTIFIED' || tab === 'FEATURED' || tab === 'REJECTED') && (
                  <button
                    disabled={bulkPending}
                    onClick={handleBulkRestore}
                    className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[#e8e0f0] text-[#4a4458] hover:border-[#7c3aed] hover:text-[#7c3aed] disabled:opacity-50 transition-colors"
                  >
                    {tab === 'SCORED'    ? '← 대기중으로'
                   : tab === 'NOTIFIED' ? '← 채점완료로'
                   : tab === 'FEATURED' ? '← 공시됨으로'
                   : '복구하기'}
                  </button>
                )}
                {tab === 'SCORED' && (
                  <button
                    disabled={bulkPending}
                    onClick={handleBulkNotify}
                    className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] disabled:opacity-50 transition-colors"
                  >
                    공시하기 →
                  </button>
                )}
                {tab === 'NOTIFIED' && (
                  <button
                    disabled={bulkPending}
                    onClick={handleBulkFeature}
                    className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
                  >
                    게시하기 →
                  </button>
                )}
                {tab !== 'REJECTED' && (
                  <button
                    disabled={bulkPending}
                    onClick={handleBulkReject}
                    className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[#e8e0f0] text-[#4a4458] hover:border-[#f87171] hover:text-[#ef4444] disabled:opacity-50 transition-colors"
                  >
                    거절하기
                  </button>
                )}
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-[13px] text-[#9b91b0] hover:text-[#4a4458] transition-colors"
                >
                  취소
                </button>
              </div>
            )}
            {isEditMode && canBulkSelect && (
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === data.content.length && data.content.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-[#c4b8d4] accent-[#7c3aed] cursor-pointer"
                />
                <span className="text-[12px] text-[#9b91b0]">전체 선택</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.content.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onClick={() => setSelectedId(idea.id)}
                  selected={isEditMode && canBulkSelect ? selectedIds.has(idea.id) : undefined}
                  onToggle={isEditMode && canBulkSelect ? toggleSelect : undefined}
                />
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
