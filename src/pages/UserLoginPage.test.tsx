import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import React from 'react'
import UserLoginPage from './UserLoginPage'

function renderAtPath(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/login${search}`]}>
      <Routes>
        <Route path="/login" element={<UserLoginPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('UserLoginPage', () => {
  it('renders Google and Kakao login buttons', () => {
    renderAtPath()
    expect(screen.getByText('Google로 계속하기')).toBeInTheDocument()
    expect(screen.getByText('카카오로 계속하기')).toBeInTheDocument()
  })

  it('shows no error banner without ?error param', () => {
    renderAtPath()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows oauth_error message for ?error=oauth_error', () => {
    renderAtPath('?error=oauth_error')
    expect(screen.getByRole('alert')).toHaveTextContent(
      '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
    )
  })

  it('shows access_denied message for ?error=access_denied', () => {
    renderAtPath('?error=access_denied')
    expect(screen.getByRole('alert')).toHaveTextContent('로그인이 취소되었습니다.')
  })

  it('shows default error message for unknown error codes', () => {
    renderAtPath('?error=unknown_code')
    expect(screen.getByRole('alert')).toHaveTextContent(
      '로그인에 실패했습니다. 다시 시도해주세요.',
    )
  })
})
