import { useQuery } from '@tanstack/react-query'
import { getIdeas } from '@/api/ideas'
import type { IdeaStatus } from '@/types'

interface UseIdeasParams {
  status?: IdeaStatus
  page?: number
}

export function useIdeas({ status, page = 0 }: UseIdeasParams) {
  return useQuery({
    queryKey: ['ideas', { status, page }],
    queryFn: () => getIdeas({ status, page }),
    staleTime: 30_000,
  })
}
