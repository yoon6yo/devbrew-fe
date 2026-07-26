import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { mockPage, mockIdeas } from './fixtures'

export const server = setupServer(
  http.get('/api/ideas', ({ request }) => {
    const url = new URL(request.url)
    const size = Number(url.searchParams.get('size') ?? 20)
    const page = Number(url.searchParams.get('page') ?? 0)
    return HttpResponse.json({
      ...mockPage,
      content: mockIdeas.slice(page * size, page * size + size),
    })
  }),
  http.get('/api/ideas/:id', ({ params }) => {
    const idea = mockIdeas.find((i) => i.id === Number(params.id))
    if (!idea) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(idea)
  }),
  http.post('/api/ideas/:id/reject', ({ params }) => {
    const idea = mockIdeas.find((i) => i.id === Number(params.id))
    if (!idea) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json({ ...idea, status: 'REJECTED' })
  })
)
