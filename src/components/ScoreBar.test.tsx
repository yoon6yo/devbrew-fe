import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ScoreBar } from './ScoreBar'

describe('ScoreBar', () => {
  it('renders score number', () => {
    render(<ScoreBar score={8} />)
    expect(screen.getByText('8')).toBeInTheDocument()
  })
  it('renders em dash when score is null', () => {
    render(<ScoreBar score={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
