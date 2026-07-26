import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useIdeas } from '@/hooks/useIdeas'
import { IdeaCard } from '@/components/IdeaCard'
import { IdeaModal } from '@/components/IdeaModal'
import { SummaryCards } from '@/components/SummaryCards'
import { Pagination } from '@/components/Pagination'
import { ExportButton } from '@/components/ExportButton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IdeaStatus } from '@/types'

const TABS: { label: string; value: IdeaStatus | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '알림 완료', value: 'NOTIFIED' },
  { label: '채점 완료', value: 'SCORED' },
  { label: '대기 중', value: 'PENDING' },
  { label: '거절됨', value: 'REJECTED' },
]

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = (searchParams.get('status') as IdeaStatus | null) ?? undefined
  const page = Number(searchParams.get('page') ?? 0)
  const [selectedId, setSelectedId] = useState<number | null>(null)

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
        <ExportButton />
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6">
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
