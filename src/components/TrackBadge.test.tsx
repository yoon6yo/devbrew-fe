import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrackBadge } from './TrackBadge'

describe('TrackBadge', () => {
  it.each(['SAAS', 'GITHUB', 'VIRAL'] as const)('renders %s', (track) => {
    render(<TrackBadge track={track} />)
    expect(screen.getByText(track)).toBeInTheDocument()
  })
})
