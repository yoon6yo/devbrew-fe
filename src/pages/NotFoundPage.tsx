import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[72px] font-bold text-[#e8e0f0] leading-none mb-4">404</p>
      <h1 className="text-[22px] font-bold text-[#2a2433] mb-3">페이지를 찾을 수 없습니다</h1>
      <p className="text-[15px] text-[#6b6080] mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        to="/"
        className="bg-[#7c3aed] text-white font-bold text-[14px] px-6 py-3 rounded-lg hover:bg-[#6d28d9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.4)]"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
