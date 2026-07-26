import type { SourceTrack } from '@/types'

const trackStyle: Record<SourceTrack, string> = {
  SAAS:   'bg-[#f3f0ec] text-[#7c3aed] border-[#e8e0f0]',
  GITHUB: 'bg-[#2a2433] text-white border-[#2a2433]',
  VIRAL:  'bg-orange-100 text-orange-700 border-orange-200',
}

export function TrackBadge({ track }: { track: SourceTrack }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${trackStyle[track]}`}>
      {track}
    </span>
  )
}
