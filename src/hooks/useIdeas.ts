import { useQuery } from '@tanstack/react-query'
import { getIdeas } from '@/api/ideas'
import type { IdeaStatus } from '@/types'

interface UseIdeasParams {
  status?: IdeaStatus
  statuses?: IdeaStatus[]
  today?: boolean
  page?: number
}

export function useIdeas({ status, statuses, today, page = 0 }: UseIdeasParams) {
  return useQuery({
    queryKey: ['ideas', { status, statuses, today, page }],
    queryFn: () => getIdeas({ status, statuses, today, page }),
    staleTime: 30_000,
  })
}
