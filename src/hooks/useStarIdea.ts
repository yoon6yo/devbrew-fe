import { useEffect, useState } from 'react'
import { starIdea, unstarIdea } from '@/api/ideas'
import { getFingerprint, isStarred, markStarred, markUnstarred } from '@/utils/fingerprint'
import { ApiError } from '@/api/client'

export function useStarIdea(ideaId: number) {
  const [starred, setStarred] = useState(() => isStarred(ideaId))
  const [localCount, setLocalCount] = useState<number | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setStarred(isStarred(ideaId))
    setLocalCount(null)
  }, [ideaId])

  async function toggle(currentCount: number) {
    if (pending) return
    setPending(true)
    const fp = getFingerprint()
    try {
      if (starred) {
        await unstarIdea(ideaId, fp)
        markUnstarred(ideaId)
        setStarred(false)
        setLocalCount(Math.max(0, currentCount - 1))
      } else {
        await starIdea(ideaId, fp)
        markStarred(ideaId)
        setStarred(true)
        setLocalCount(currentCount + 1)
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        markStarred(ideaId)
        setStarred(true)
      }
    } finally {
      setPending(false)
    }
  }

  return { starred, localCount, pending, toggle }
}
