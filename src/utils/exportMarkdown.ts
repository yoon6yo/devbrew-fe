import type { IdeaDto } from '@/types'

const TRACK_LABEL: Record<string, string> = {
  SAAS: 'SaaS',
  GITHUB: 'GitHub 트렌드',
  VIRAL: '바이럴',
}

const STATUS_LABEL: Record<string, string> = {
  NOTIFIED: '공시됨',
  SCORED: '채점 완료',
  PENDING: '대기 중',
  REJECTED: '거절됨',
}

function scoreBar(score: number | null): string {
  if (score === null) return '-'
  const filled = Math.round(score / 10)
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` ${score}점`
}

function section(title: string, content: string | null | undefined): string {
  if (!content) return ''
  return `\n### ${title}\n\n${content}\n`
}

export function downloadMarkdown(ideas: IdeaDto[], filename = 'daybrew-top5.md'): void {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  const body = ideas.map((idea, i) => {
    const score = idea.score !== null ? scoreBar(idea.score) : '미채점'
    const track = TRACK_LABEL[idea.sourceTrack] ?? idea.sourceTrack
    const status = STATUS_LABEL[idea.status] ?? idea.status

    const scoreDetails = [
      idea.scoreMarketFit !== null ? `시장적합성 ${idea.scoreMarketFit}` : null,
      idea.scoreNovelty !== null ? `참신성 ${idea.scoreNovelty}` : null,
      idea.scoreFeasibility !== null ? `실현가능성 ${idea.scoreFeasibility}` : null,
      idea.scoreMonetization !== null ? `수익성 ${idea.scoreMonetization}` : null,
      idea.scoreTrend !== null ? `트렌드 ${idea.scoreTrend}` : null,
    ].filter(Boolean).join(' · ')

    return [
      `## ${i + 1}. ${idea.title}`,
      '',
      `> **트랙:** ${track} · **종합 점수:** ${score} · **상태:** ${status}`,
      scoreDetails ? `> ${scoreDetails}` : '',
      '',
      `${idea.description}`,
      section('왜 필요한가', idea.purpose),
      section('동작 방식', idea.howItWorks),
      section('기술 스택', idea.suggestedStack),
      idea.scoreReason ? section('AI 평가', idea.scoreReason) : '',
      idea.sourceUrl ? `\n> 📌 출처: ${idea.sourceUrl}\n` : '',
      '---',
    ].filter(line => line !== undefined).join('\n')
  }).join('\n\n')

  const markdown = `# daybrew — 오늘의 Top ${ideas.length} 아이디어\n\n_${today} 기준_\n\n---\n\n${body}\n`

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
