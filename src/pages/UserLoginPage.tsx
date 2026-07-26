import { useSearchParams } from 'react-router-dom'

const ERROR_MESSAGES: Record<string, string> = {
  oauth_error: '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
  access_denied: '로그인이 취소되었습니다.',
  default: '로그인에 실패했습니다. 다시 시도해주세요.',
}

export default function UserLoginPage() {
  const [searchParams] = useSearchParams()
  const errorParam = searchParams.get('error')
  const errorMessage = errorParam
    ? (ERROR_MESSAGES[errorParam] ?? ERROR_MESSAGES.default)
    : null

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4">
      <div className="bg-white border border-[#e8e0f0] rounded-xl p-10 w-full max-w-sm shadow-[0_4px_16px_rgba(124,58,237,0.08)]">
        <div className="mb-8 text-center">
          <a href="/" className="text-xl font-bold text-[#2a2433] hover:text-[#7c3aed] transition-colors">
            DevBrew
          </a>
          <p className="text-[14px] text-[#8b8398] mt-2">로그인하여 오늘의 아이디어를 확인하세요</p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600 text-center"
          >
            {errorMessage}
          </div>
        )}

        <div className="space-y-3">
          <a
            href="/oauth2/authorization/google"
            className="flex items-center justify-center gap-3 w-full border border-[#e8e0f0] rounded-lg px-4 py-3 text-[14px] font-bold text-[#2a2433] bg-white hover:border-[#d9cce8] hover:bg-[#f3f0ec] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)]"
          >
            <GoogleIcon />
            Google로 계속하기
          </a>

          <a
            href="/oauth2/authorization/kakao"
            className="flex items-center justify-center gap-3 w-full bg-[#FEE500] rounded-lg px-4 py-3 text-[14px] font-bold text-[#191919] hover:bg-[#f0d800] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEE500]"
          >
            <KakaoIcon />
            카카오로 계속하기
          </a>
        </div>

        <p className="text-center text-[12px] text-[#8b8398] mt-8">
          로그인 시{' '}
          <a href="/terms" className="text-[#4a4458] hover:underline hover:text-[#7c3aed] transition-colors">이용약관</a>
          {' '}및{' '}
          <a href="/privacy" className="text-[#4a4458] hover:underline hover:text-[#7c3aed] transition-colors">개인정보처리방침</a>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.029 0 0 3.134 0 7c0 2.497 1.659 4.696 4.163 5.97L3.1 17.1a.3.3 0 0 0 .458.32L8.9 13.97c.033.001.066.03.1.03 4.971 0 9-3.134 9-7S13.971 0 9 0z" fill="#191919"/>
    </svg>
  )
}
