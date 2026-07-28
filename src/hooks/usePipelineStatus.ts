import { useState, useEffect, useRef } from 'react'
import { getPipelineStatus, type PipelineStatus } from '@/api/adminStats'

export function usePipelineStatus(active: boolean) {
  const [status, setStatus] = useState<PipelineStatus | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const s = await getPipelineStatus()
        if (!cancelled) {
          setStatus(s)
          const delay = s.running || activeRef.current ? 2000 : 60_000
          timerRef.current = setTimeout(poll, delay)
        }
      } catch {
        if (!cancelled) {
          timerRef.current = setTimeout(poll, activeRef.current ? 3000 : 60_000)
        }
      }
    }

    poll()
    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return status
}
