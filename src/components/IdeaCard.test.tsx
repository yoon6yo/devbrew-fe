import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IdeaCard } from './IdeaCard'
import { mockIdea } from '@/test/fixtures'

describe('IdeaCard', () => {
  it('renders title and score', () => {
    render(<IdeaCard idea={mockIdea} onClick={() => {}} />)
    expect(screen.getByText(mockIdea.title)).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<IdeaCard idea={mockIdea} onClick={onClick} />)
    await userEvent.click(screen.getByRole('article'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('calls onClick when Enter key is pressed', async () => {
    const onClick = vi.fn()
    render(<IdeaCard idea={mockIdea} onClick={onClick} />)
    screen.getByRole('article').focus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('calls onClick when Space key is pressed', async () => {
    const onClick = vi.fn()
    render(<IdeaCard idea={mockIdea} onClick={onClick} />)
    screen.getByRole('article').focus()
    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledOnce()
  })
})
