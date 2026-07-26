import { test, expect } from '@playwright/test'
import { loginAsAdmin, mockCoreApi } from './helpers'

test.describe('Authentication', () => {
  test('admin login: valid credentials redirect to dashboard', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'DevBrew' })).toBeVisible()
  })

  test('admin login: invalid credentials show error message', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 401, json: { message: 'Unauthorized' } })
    })
    await page.goto('/admin/login')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.getByText('아이디 또는 비밀번호가 올바르지 않습니다.')).toBeVisible()
    await expect(page).toHaveURL('/admin/login')
  })

  test('admin login: shows loading state while submitting', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await new Promise((r) => setTimeout(r, 500))
      await route.fulfill({ json: { token: 'mock-token' } })
    })
    await mockCoreApi(page, 'ADMIN')
    await page.goto('/admin/login')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    await expect(page.getByRole('button', { name: '로그인 중…' })).toBeVisible()
  })

  test('protected route: unauthenticated user redirected to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('logout: clears storage and redirects to /login', async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByRole('button', { name: '로그아웃' }).click()
    await expect(page).toHaveURL('/login')
    const token = await page.evaluate(() => localStorage.getItem('devbrew_token'))
    const auth = await page.evaluate(() => localStorage.getItem('daybrew_auth'))
    const role = await page.evaluate(() => localStorage.getItem('daybrew_role'))
    expect(token).toBeNull()
    expect(auth).toBeNull()
    expect(role).toBeNull()
  })
})
