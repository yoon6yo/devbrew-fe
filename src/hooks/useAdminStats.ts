import { useQuery } from '@tanstack/react-query'
import { getAdminStats } from '@/api/adminStats'

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    staleTime: 5 * 60 * 1000,
  })
}
