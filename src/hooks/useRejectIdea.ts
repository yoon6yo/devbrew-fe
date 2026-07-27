import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectIdea } from '@/api/ideas'
import type { IdeaDto, PageResponse } from '@/types'

export function useRejectIdea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => rejectIdea(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['ideas'] })
      const snapshots = queryClient.getQueriesData<PageResponse<IdeaDto>>({ queryKey: ['ideas'] })
      queryClient.setQueriesData<PageResponse<IdeaDto>>(
        { queryKey: ['ideas'] },
        (old) => old
          ? { ...old, content: old.content.map((idea) => idea.id === id ? { ...idea, status: 'REJECTED' as const } : idea) }
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
      queryClient.invalidateQueries({ queryKey: ['ideaStats'] })
    },
  })
}
