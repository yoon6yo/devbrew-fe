import { describe, it, expect, vi, beforeEach } from 'vitest'
import { downloadJson } from './exportJson'
import { mockIdeas } from '@/test/fixtures'

describe('downloadJson', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() })
    const a = { href: '', download: '', click: vi.fn(), remove: vi.fn() } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(a)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => a)
  })
  it('creates a JSON blob and triggers download', () => {
    downloadJson(mockIdeas, 'test.json')
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
  })
})
