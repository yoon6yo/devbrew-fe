import { useQuery } from '@tanstack/react-query'
import { getIdea } from '@/api/ideas'

export function useIdeaDetail(id: number | null) {
  return useQuery({
    queryKey: ['idea', id],
    queryFn: () => getIdea(id!),
    enabled: id !== null,
    staleTime: 30_000,
  })
}
