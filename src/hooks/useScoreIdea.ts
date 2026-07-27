import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scoreIdea } from '@/api/ideas'

export function useScoreIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => scoreIdea(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['idea'] })
      queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    },
  })
}
