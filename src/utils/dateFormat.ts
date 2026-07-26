export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    timeZone: 'Asia/Seoul',
  }).format(new Date(iso))
}
