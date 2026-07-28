import { useState, useEffect, useRef } from 'react'
import { getPipelineStatus, type PipelineStatus } from '@/api/adminStats'

export function usePipelineStatus(active: boolean) {
  const [status, setStatus] = useState<PipelineStatus | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) return

    let cancelled = false

    async function poll() {
      try {
        const s = await getPipelineStatus()
        if (!cancelled) {
          setStatus(s)
          if (s.running) {
            timerRef.current = setTimeout(poll, 2000)
          }
        }
      } catch {
        if (!cancelled) {
          timerRef.current = setTimeout(poll, 3000)
        }
      }
    }

    poll()
    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active])

  return status
}
