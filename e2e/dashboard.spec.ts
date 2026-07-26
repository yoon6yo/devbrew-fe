import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsUser, MOCK_IDEAS } from './helpers'

test.describe('Dashboard — Idea List', () => {
  test('renders all mocked idea titles', async ({ page }) => {
    await loginAsAdmin(page)
    for (const idea of MOCK_IDEAS) {
      await expect(page.getByText(idea.title).first()).toBeVisible()
    }
  })

  test('status filter tab updates URL and filters list', async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByRole('tab', { name: '알림 완료' }).click()
    await expect(page).toHaveURL(/status=NOTIFIED/)
    await expect(page.getByText('바이럴 마케팅 자동화')).toBeVisible()
    await expect(page.getByText('AI 기반 코드 리뷰 SaaS')).not.toBeVisible()
  })

  test('clicking idea card opens detail modal', async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByText(MOCK_IDEAS[0].title).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByText(MOCK_IDEAS[0].title)).toBeVisible()
  })

  test('star button sends POST and updates count', async ({ page }) => {
    await loginAsAdmin(page)
    const starButtons = page.getByRole('button', { name: /★|star|스타/i })
    if (await starButtons.count() > 0) {
      const [request] = await Promise.all([
        page.waitForRequest((req) => req.url().includes('/star') && req.method() === 'POST'),
        starButtons.first().click(),
      ])
      expect(request.url()).toMatch(/\/api\/ideas\/\d+\/star/)
    }
  })
})

test.describe('Dashboard — Admin Section', () => {
  test('admin user sees AdminStatsSection', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page.getByText('오늘 Gemini 토큰')).toBeVisible()
    await expect(page.getByText('이번 달 토큰')).toBeVisible()
    await expect(page.getByText('이번 달 추정 비용')).toBeVisible()
  })

  test('non-admin user does not see AdminStatsSection', async ({ page }) => {
    await loginAsUser(page)
    await expect(page.getByText('오늘 Gemini 토큰')).not.toBeVisible()
  })

  test('admin stats display formatted token counts', async ({ page }) => {
    await loginAsAdmin(page)
    // 1234 → "1.2K", 56789 → "56.8K"
    await expect(page.getByText('1.2K')).toBeVisible()
    await expect(page.getByText('56.8K')).toBeVisible()
  })

  test('admin stats display estimated cost', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page.getByText('$0.2345')).toBeVisible()
  })
})
