import { describe, it, expect } from 'vitest'
import { formatDate } from './dateFormat'

describe('formatDate', () => {
  it('formats ISO date in Korean locale', () => {
    const result = formatDate('2026-07-27T09:00:00+09:00')
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/07/)
    expect(result).toMatch(/27/)
  })

  it('handles UTC date and converts to KST', () => {
    const result = formatDate('2026-01-01T00:00:00Z')
    // UTC midnight = KST 09:00, still Jan 1
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/01/)
  })

  it('formats dates consistently with Intl.DateTimeFormat ko-KR', () => {
    const expected = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      timeZone: 'Asia/Seoul',
    }).format(new Date('2026-03-15T12:00:00+09:00'))
    expect(formatDate('2026-03-15T12:00:00+09:00')).toBe(expected)
  })
})
