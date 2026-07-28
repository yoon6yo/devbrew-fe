const KEY = 'daybrew_fp'

export function getFingerprint(): string {
  let fp = localStorage.getItem(KEY)
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem(KEY, fp)
  }
  return fp
}

const STARRED_KEY = 'daybrew_starred'

function loadStarred(): Set<number> {
  try {
    const raw = localStorage.getItem(STARRED_KEY)
    return new Set(raw ? (JSON.parse(raw) as number[]) : [])
  } catch {
    return new Set()
  }
}

function saveStarred(set: Set<number>): void {
  localStorage.setItem(STARRED_KEY, JSON.stringify([...set]))
}

export function isStarred(ideaId: number): boolean {
  return loadStarred().has(ideaId)
}

export function markStarred(ideaId: number): void {
  const set = loadStarred()
  set.add(ideaId)
  saveStarred(set)
}

export function markUnstarred(ideaId: number): void {
  const set = loadStarred()
  set.delete(ideaId)
  saveStarred(set)
}
