import { Link } from 'react-router-dom'

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-[#2a2433] mb-3">이용약관</h1>
        <p className="text-[14px] text-[#6b6080] mb-12">최종 수정일: 2025년 7월 27일</p>

        <div className="space-y-10">

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제1조 (목적)</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed">
              이 약관은 daybrew(이하 "서비스")가 제공하는 개발 아이디어 큐레이션 서비스의 이용과 관련하여 서비스와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제2조 (정의)</h2>
            <ul className="space-y-3">
              {[
                { term: '"서비스"', def: 'daybrew가 운영하는 개발 아이디어 큐레이션 플랫폼 및 관련 부가서비스를 의미합니다.' },
                { term: '"이용자"', def: '이 약관에 동의하고 서비스를 이용하는 모든 회원 및 비회원을 의미합니다.' },
                { term: '"회원"', def: '서비스에 회원가입하여 계정을 보유하고 서비스를 이용하는 자를 의미합니다.' },
                { term: '"아이디어"', def: '서비스가 수집·분석하여 제공하는 개발 프로젝트 아이디어 및 관련 콘텐츠를 의미합니다.' },
              ].map(({ term, def }) => (
                <li key={term} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  <span><span className="font-medium text-[#2a2433]">{term}</span>란 {def}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제3조 (약관의 효력 및 변경)</h2>
            <ul className="space-y-2">
              {[
                '이 약관은 서비스 화면에 게시하거나 이용자에게 공지함으로써 효력이 발생합니다.',
                '서비스는 합리적인 사유가 있는 경우 관련 법령에 위배되지 않는 범위 내에서 이 약관을 변경할 수 있습니다.',
                '약관 변경 시 적용 일자 및 변경 사유를 명시하여 서비스 내 공지합니다. 변경된 약관은 공지 후 7일이 지난 시점부터 효력이 발생합니다.',
                '이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제4조 (회원가입 및 계정)</h2>
            <ul className="space-y-2">
              {[
                '이용자는 Google 소셜 로그인을 통해 회원가입을 신청할 수 있습니다.',
                '서비스는 가입 신청자가 다음 각호에 해당하는 경우 가입을 거부하거나 사후에 이용계약을 해지할 수 있습니다: 타인의 정보를 도용한 경우, 이전에 서비스 이용 자격을 상실한 경우, 기타 서비스 운영을 방해한다고 판단되는 경우.',
                '이용자는 계정 정보를 제3자에게 양도하거나 공유해서는 안 됩니다.',
                '계정 도용 또는 부정 사용을 인지한 경우 즉시 서비스에 신고해야 합니다.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제5조 (서비스의 제공)</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed mb-3">
              서비스는 다음과 같은 콘텐츠 및 기능을 제공합니다.
            </p>
            <ul className="space-y-2">
              {[
                'Reddit, GitHub 등 개발자 커뮤니티 신호 기반 아이디어 큐레이션',
                'AI 기반 시장 적합성·실현 가능성 채점 및 분류',
                '아이디어별 기술 스택 추천 및 기획서 제공',
                '매일 아침 업데이트되는 개발 아이디어 피드',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[14px] text-[#6b6080] mt-4 leading-relaxed">
              서비스는 운영상·기술상 필요에 따라 서비스 내용을 변경할 수 있으며, 서비스 중단이 필요한 경우 사전에 공지합니다. 단, 불가피한 사유가 있는 경우 사후 공지할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제6조 (이용자의 의무)</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed mb-3">이용자는 다음 각호의 행위를 해서는 안 됩니다.</p>
            <div className="bg-[#f3f0ec] border border-[#e8e0f0] rounded-xl p-5">
              <ul className="space-y-2">
                {[
                  '서비스가 제공하는 콘텐츠를 무단으로 복제·배포·상업적으로 이용하는 행위',
                  '서비스 운영을 방해하거나 서버에 과부하를 유발하는 행위',
                  '타인의 개인정보를 수집·저장·공개하는 행위',
                  '관련 법령을 위반하거나 서비스의 정상적인 운영을 저해하는 행위',
                  '서비스를 이용하여 얻은 정보를 허가 없이 상업적 목적으로 활용하는 행위',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-[#4a4458] leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제7조 (지식재산권)</h2>
            <ul className="space-y-2">
              {[
                '서비스가 제공하는 모든 콘텐츠(아이디어, 텍스트, 이미지, UI 디자인 등)의 저작권 및 지식재산권은 서비스에 귀속됩니다.',
                '이용자는 서비스를 이용함으로써 얻은 정보를 서비스의 사전 승낙 없이 복제·전송·출판·배포·방송 등의 방법으로 이용하거나 제3자에게 제공할 수 없습니다.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제8조 (면책 조항)</h2>
            <ul className="space-y-2">
              {[
                '서비스는 천재지변, 불가항력적 사유 또는 이용자의 귀책 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.',
                '서비스가 제공하는 아이디어 및 분석 정보는 참고용으로만 제공되며, 이를 기반으로 한 사업적 결정의 결과에 대해 서비스는 책임을 지지 않습니다.',
                '서비스는 이용자 간 또는 이용자와 제3자 간의 분쟁에 개입하지 않으며 이에 따른 손해를 배상할 책임이 없습니다.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제9조 (서비스 이용 제한 및 해지)</h2>
            <ul className="space-y-2">
              {[
                '서비스는 이용자가 이 약관을 위반한 경우 사전 통보 없이 서비스 이용을 제한하거나 계정을 정지·삭제할 수 있습니다.',
                '이용자는 언제든지 서비스 내 계정 설정을 통해 탈퇴(이용계약 해지)를 신청할 수 있습니다.',
                '탈퇴 시 회원 정보 및 서비스 이용 기록은 개인정보처리방침에 따라 처리됩니다.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-[#4a4458] leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7c3aed] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">제10조 (분쟁 해결 및 관할)</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed">
              이 약관과 관련한 분쟁은 대한민국 법률을 준거법으로 하며, 소송이 제기될 경우 관할 법원은 민사소송법에 따른 법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#2a2433] mb-3">부칙</h2>
            <p className="text-[15px] text-[#4a4458] leading-relaxed">
              이 약관은 2025년 7월 27일부터 시행됩니다.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e0f0] py-8 mt-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-[15px] font-bold text-[#2a2433]">daybrew</span>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-[14px] text-[#6b6080] hover:text-[#4a4458] transition-colors">개인정보처리방침</Link>
            <Link to="/terms" className="text-[14px] text-[#7c3aed] font-medium hover:underline">이용약관</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
