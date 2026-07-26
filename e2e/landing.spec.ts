import { test, expect } from '@playwright/test'
import { mockCoreApi } from './helpers'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockCoreApi(page)
    await page.goto('/')
  })

  test('renders brand name and hero heading', async ({ page }) => {
    await expect(page.getByText('DevBrew').first()).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('아이디어')
  })

  test('시작하기 link navigates to user login', async ({ page }) => {
    await page.getByRole('link', { name: '시작하기' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('how-it-works section renders 3 steps', async ({ page }) => {
    await page.getByRole('link', { name: '어떻게 동작하나요' }).click()
    await expect(page.getByText('신호 수집')).toBeVisible()
    await expect(page.getByText('AI 분석 · 채점')).toBeVisible()
    await expect(page.getByText('기획서 전달')).toBeVisible()
  })

  test('오늘의 아이디어 section renders mocked ideas', async ({ page }) => {
    await page.getByRole('link', { name: '오늘의 아이디어 보기' }).click()
    await expect(page.getByText('AI 기반 코드 리뷰 SaaS')).toBeVisible()
  })

  test('footer contains brand and tagline', async ({ page }) => {
    await expect(page.getByText('매일 아침 개발 아이디어를 배달합니다')).toBeVisible()
  })
})
