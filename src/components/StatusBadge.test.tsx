import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it.each([
    ['NOTIFIED', '알림 완료', 'green'],
    ['SCORED',   '채점 완료', 'blue'],
    ['PENDING',  '대기 중',   'amber'],
    ['REJECTED', '거절됨',    'gray'],
  ] as const)('renders %s as "%s" with %s class', (status, label, color) => {
    render(<StatusBadge status={status} />)
    expect(screen.getByText(label).className).toMatch(color)
  })
})
