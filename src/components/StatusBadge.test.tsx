import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders NOTIFIED with green class', () => {
    render(<StatusBadge status="NOTIFIED" />)
    expect(screen.getByText('NOTIFIED').className).toMatch(/green/)
  })
  it.each([['SCORED', 'blue'], ['PENDING', 'amber'], ['REJECTED', 'gray']] as const)(
    'renders %s with %s class', (status, color) => {
      render(<StatusBadge status={status} />)
      expect(screen.getByText(status).className).toMatch(color)
    }
  )
})
