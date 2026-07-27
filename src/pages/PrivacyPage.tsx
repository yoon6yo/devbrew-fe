import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#4a4458] tracking-[-0.3px]">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-[#faf9f6]/90 backdrop-blur border-b border-[#e8e0f0] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-[#2a2433] hover:opacity-80 transition-opacity">
            daybrew
          </Link>
          <Link
            to="/"
            className="text-[14px] font-bold text-[#2a2433] border border-[#e8e0f0] px-4 py-2 rounded-lg hover:border-[#d9cce8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)]"
          >
            홈으로
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#2a2433] mb-3">개인정보처리방침</h1>
        <p className="text-[14px] text-[#6b6080] mb-12">최종 수정일: 2025년 7월 27일</p>

        <div className="space-y-10">

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">1. 개인정보 수집 항목 및 수집 방법</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed mb-3">
              daybrew(이하 "서비스")는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.
            </p>
            <div className="bg-[#f3f0ec] border border-[#e8e0f0] rounded-xl p-5">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#e8e0f0]">
                    <th className="text-left text-[#2a2433] font-bold pb-3 pr-4">구분</th>
                    <th className="text-left text-[#2a2433] font-bold pb-3 pr-4">수집 항목</th>
                    <th className="text-left text-[#2a2433] font-bold pb-3">수집 방법</th>
                  </tr>
                </thead>
                <tbody className="text-[#4a4458]">
                  <tr className="border-b border-[#e8e0f0]">
                    <td className="py-3 pr-4 font-medium">필수</td>
                    <td className="py-3 pr-4">이메일 주소, 이름(닉네임)</td>
                    <td className="py-3">Google OAuth2 소셜 로그인</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">자동 수집</td>
                    <td className="py-3 pr-4">서비스 이용 기록, 접속 로그, IP 주소</td>
                    <td className="py-3">서비스 이용 과정 중 자동 생성</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">2. 개인정보의 수집 및 이용 목적</h2>
            <ul className="space-y-2">
              {[
                '회원 식별 및 인증, 서비스 로그인 처리',
                '개발 아이디어 피드 및 기획서 서비스 제공',
                '서비스 이용 통계 분석 및 서비스 품질 개선',
                '불법 이용 방지 및 서비스 운영·유지',
                '고객 문의 응대 및 공지사항 전달',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed mb-4">
              회원의 개인정보는 수집 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 따라 아래와 같이 일정 기간 보관할 수 있습니다.
            </p>
            <div className="bg-[#f3f0ec] border border-[#e8e0f0] rounded-xl p-5 space-y-3">
              {[
                { law: '전자상거래 등에서의 소비자 보호에 관한 법률', period: '계약 또는 청약철회 기록: 5년' },
                { law: '전자상거래 등에서의 소비자 보호에 관한 법률', period: '소비자 불만 또는 분쟁처리 기록: 3년' },
                { law: '통신비밀보호법', period: '로그인 기록: 3개월' },
              ].map(({ law, period }) => (
                <div key={period} className="text-[14px] text-[#4a4458]">
                  <span className="font-medium text-[#2a2433]">{period}</span>
                  <span className="text-[#6b6080] ml-2">({law})</span>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-[#6b6080] mt-3 leading-relaxed">
              회원 탈퇴 시 수집된 개인정보는 즉시 파기되며, 단 위 법령에 따른 보관 의무가 있는 정보는 해당 기간 동안 별도 보관 후 파기됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed">
              daybrew는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의한 경우에는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">5. 개인정보 처리의 위탁</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed mb-3">
              서비스 운영을 위해 아래와 같이 개인정보 처리를 위탁하고 있습니다.
            </p>
            <div className="bg-[#f3f0ec] border border-[#e8e0f0] rounded-xl p-5">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#e8e0f0]">
                    <th className="text-left text-[#2a2433] font-bold pb-3 pr-4">수탁 업체</th>
                    <th className="text-left text-[#2a2433] font-bold pb-3">위탁 업무</th>
                  </tr>
                </thead>
                <tbody className="text-[#4a4458]">
                  <tr className="border-b border-[#e8e0f0]">
                    <td className="py-3 pr-4">Google LLC</td>
                    <td className="py-3">소셜 로그인 인증 처리</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Amazon Web Services</td>
                    <td className="py-3">서버 인프라 운영 및 데이터 보관</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">6. 이용자의 권리와 행사 방법</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed mb-3">
              이용자는 언제든지 아래의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="space-y-2">
              {[
                '개인정보 열람 요청',
                '오류 정정 요청',
                '삭제 요청 (회원 탈퇴)',
                '처리 정지 요청',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[14px] text-[#6b6080] mt-3 leading-relaxed">
              권리 행사는 서비스 내 계정 설정 또는 아래 개인정보 보호책임자에게 이메일로 요청하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">7. 쿠키 및 유사 기술의 사용</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed">
              daybrew는 로그인 상태 유지 및 서비스 이용 편의를 위해 쿠키와 로컬 스토리지를 사용합니다. 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 서비스 이용에 제한이 생길 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">8. 개인정보의 안전성 확보 조치</h2>
            <ul className="space-y-2">
              {[
                '개인정보 전송 시 SSL/TLS 암호화 적용',
                '접근 권한 최소화 및 정기적 권한 검토',
                '외부 침입 차단을 위한 보안 시스템 운영',
                '개인정보 처리 직원 대상 정기 보안 교육',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">9. 개인정보 보호책임자</h2>
            <div className="bg-[#f3f0ec] border border-[#e8e0f0] rounded-xl p-5 text-[14px] text-[#4a4458] space-y-1">
              <p><span className="font-medium text-[#2a2433]">서비스명:</span> daybrew</p>
              <p><span className="font-medium text-[#2a2433]">문의 이메일:</span> <a href="mailto:2025112405@dgu.ac.kr" className="text-[#7c3aed] hover:underline">2025112405@dgu.ac.kr</a></p>
            </div>
            <p className="text-[14px] text-[#6b6080] mt-3 leading-relaxed">
              개인정보 처리에 관한 불만 또는 피해 구제를 위해 개인정보 분쟁조정위원회(www.kopico.go.kr) 또는 개인정보침해신고센터(privacy.kisa.or.kr)에 신고하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">10. 방침 변경</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed">
              본 개인정보처리방침은 법령, 정책 또는 서비스 변경에 따라 개정될 수 있으며, 변경 시 서비스 내 공지사항을 통해 사전에 안내합니다.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e0f0] py-8 mt-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-[15px] font-bold text-[#2a2433]">daybrew</span>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-[14px] text-[#7c3aed] font-medium hover:underline">개인정보처리방침</Link>
            <Link to="/terms" className="text-[14px] text-[#6b6080] hover:text-[#4a4458] transition-colors">이용약관</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
