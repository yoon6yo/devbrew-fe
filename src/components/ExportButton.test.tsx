import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { ExportButton } from './ExportButton'
import * as exportJson from '@/utils/exportJson'
import * as exportCsv from '@/utils/exportCsv'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('ExportButton', () => {
  it('renders format selector and export button in idle state', () => {
    render(<ExportButton />, { wrapper })
    expect(screen.getByLabelText('내보내기 형식')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Top 5 Export' })).toBeInTheDocument()
  })

  it('exports JSON by default when button clicked', async () => {
    const downloadJson = vi.spyOn(exportJson, 'downloadJson').mockImplementation(() => {})
    render(<ExportButton />, { wrapper })

    await userEvent.click(screen.getByRole('button', { name: 'Top 5 Export' }))
    await waitFor(() => expect(downloadJson).toHaveBeenCalledOnce())
  })

  it('exports CSV when format is changed to CSV', async () => {
    const downloadCsv = vi.spyOn(exportCsv, 'downloadCsv').mockImplementation(() => {})
    render(<ExportButton />, { wrapper })

    await userEvent.selectOptions(screen.getByLabelText('내보내기 형식'), 'CSV')
    await userEvent.click(screen.getByRole('button', { name: 'Top 5 Export' }))
    await waitFor(() => expect(downloadCsv).toHaveBeenCalledOnce())
  })
})
