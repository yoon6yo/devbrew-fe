import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[48px] font-bold text-[#e8e0f0] leading-none mb-4">!</p>
          <h1 className="text-[20px] font-bold text-[#2a2433] mb-3">문제가 발생했습니다</h1>
          <p className="text-[14px] text-[#6b6080] mb-8">
            페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#7c3aed] text-white font-bold text-[14px] px-6 py-3 rounded-lg hover:bg-[#6d28d9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.4)]"
          >
            새로고침
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
