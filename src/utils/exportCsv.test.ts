import { describe, it, expect, vi, beforeEach } from 'vitest'
import { downloadCsv } from './exportCsv'
import { mockIdeas } from '@/test/fixtures'

describe('downloadCsv', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() })
    const a = { href: '', download: '', click: vi.fn(), remove: vi.fn() } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(a)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => a)
  })
  it('creates a CSV blob with correct mime type', () => {
    downloadCsv(mockIdeas)
    const [blob] = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0]
    expect((blob as Blob).type).toBe('text/csv;charset=utf-8;')
  })
})
