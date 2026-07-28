import { useState, useEffect, useRef } from 'react'
import { getPipelineStatus, type PipelineStatus } from '@/api/adminStats'

export function usePipelineStatus(active: boolean) {
  const [status, setStatus] = useState<PipelineStatus | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef(active)
  const triggerRef = useRef<(() => void) | null>(null)
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

    triggerRef.current = () => { if (!cancelled) poll() }
    poll()
    return () => {
      cancelled = true
      triggerRef.current = null
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // When active flips true (score/collect triggered), cancel the pending slow timer
  // and immediately poll so the UI reflects the running state within seconds.
  useEffect(() => {
    if (!active) return
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    triggerRef.current?.()
  }, [active])

  return status
}
