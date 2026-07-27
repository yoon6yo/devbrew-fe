import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyIdea } from '@/api/ideas'
import type { IdeaDto, PageResponse } from '@/types'

export function useNotifyIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notifyIdea(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['ideas'] })
      const snapshots = queryClient.getQueriesData<PageResponse<IdeaDto>>({ queryKey: ['ideas'] })
      queryClient.setQueriesData<PageResponse<IdeaDto>>(
        { queryKey: ['ideas'] },
        (old) => old
          ? { ...old, content: old.content.map((idea) => idea.id === id ? { ...idea, status: 'NOTIFIED' as const } : idea) }
          : old
      )
      return { snapshots }
    },
    onError: (_err, _id, context) => {
      context?.snapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['idea'] })
      queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    },
  })
}
