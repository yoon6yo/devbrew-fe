import { useQuery } from '@tanstack/react-query'
import { getIdeaStats } from '@/api/ideas'

export function useIdeaStats() {
  return useQuery({
    queryKey: ['ideaStats'],
    queryFn: getIdeaStats,
    staleTime: 60_000,
  })
}
