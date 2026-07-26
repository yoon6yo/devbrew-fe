export function Pagination({ page, totalPages, onPageChange }: {
  page: number; totalPages: number; onPageChange: (p: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 0}
        className="px-3 py-1.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-30">‹</button>
      {[...Array(totalPages)].map((_, i) => (
        <button key={i} onClick={() => onPageChange(i)}
          className={`w-8 h-8 rounded-lg text-sm font-medium ${i === page ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>
          {i + 1}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages - 1}
        className="px-3 py-1.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-30">›</button>
    </div>
  )
}
