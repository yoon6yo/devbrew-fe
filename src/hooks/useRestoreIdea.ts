import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restoreIdea } from '@/api/ideas'

export function useRestoreIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => restoreIdea(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['idea'] })
      queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    },
  })
}
