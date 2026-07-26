import type { SourceTrack } from '@/types'

const trackStyle: Record<SourceTrack, string> = {
  SAAS:   'bg-purple-100 text-purple-700 border-purple-200',
  GITHUB: 'bg-neutral-900 text-white border-neutral-700',
  VIRAL:  'bg-orange-100 text-orange-700 border-orange-200',
}

export function TrackBadge({ track }: { track: SourceTrack }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${trackStyle[track]}`}>
      {track}
    </span>
  )
}
