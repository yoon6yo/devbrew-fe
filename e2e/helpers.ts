import type { Page } from '@playwright/test'

export const MOCK_IDEAS = [
  {
    id: 1, title: 'AI 기반 코드 리뷰 SaaS', description: '개발자를 위한 AI 코드 리뷰 플랫폼.',
    sourceTrack: 'SAAS', sourceUrl: 'https://example.com',
    score: 8, scoreMarketFit: 9, scoreNovelty: 7, scoreFeasibility: 8, scoreMonetization: 8, scoreTrend: 7,
    scoreReason: 'PMF 명확, 시장 규모 큼', starCount: 3, status: 'SCORED',
    createdAt: '2026-07-26T09:00:00+09:00', purpose: null, howItWorks: null, suggestedStack: null,
  },
  {
    id: 2, title: 'GitHub 트렌드 분석 툴', description: 'GitHub 트렌드를 분석하는 툴.',
    sourceTrack: 'GITHUB', sourceUrl: null,
    score: 6, scoreMarketFit: 6, scoreNovelty: 5, scoreFeasibility: 7, scoreMonetization: 5, scoreTrend: 6,
    scoreReason: '경쟁 많음', starCount: 0, status: 'PENDING',
    createdAt: '2026-07-26T10:00:00+09:00', purpose: null, howItWorks: null, suggestedStack: null,
  },
  {
    id: 3, title: '바이럴 마케팅 자동화', description: '바이럴 콘텐츠 자동화 플랫폼.',
    sourceTrack: 'VIRAL', sourceUrl: 'https://example.com/viral',
    score: 9, scoreMarketFit: 9, scoreNovelty: 8, scoreFeasibility: 9, scoreMonetization: 9, scoreTrend: 9,
    scoreReason: '높은 성장성', starCount: 12, status: 'NOTIFIED',
    createdAt: '2026-07-26T11:00:00+09:00', purpose: null, howItWorks: null, suggestedStack: null,
  },
]

export const MOCK_PAGE = {
  content: MOCK_IDEAS,
  totalElements: 3,
  totalPages: 1,
  number: 0,
  size: 20,
}

export const MOCK_ADMIN_STATS = {
  gemini: { todayTokens: 1234, monthTokens: 56789, estimatedMonthlyCostUsd: 0.2345 },
  pageViews: [
    { date: '2026-07-24', count: 45 },
    { date: '2026-07-25', count: 62 },
    { date: '2026-07-26', count: 28 },
  ],
}

export async function mockCoreApi(page: Page, role: 'ADMIN' | 'USER' = 'ADMIN') {
  // Register specific routes before the catch-all to avoid glob overlap
  await page.route('**/api/ideas/*/star', async (route) => {
    const method = route.request().method()
    const id = Number(route.request().url().match(/\/api\/ideas\/(\d+)\/star/)?.[1] ?? 1)
    const idea = MOCK_IDEAS.find((i) => i.id === id) ?? MOCK_IDEAS[0]
    if (method === 'POST') {
      await route.fulfill({ status: 201, json: { ...idea, starCount: idea.starCount + 1 } })
    } else {
      await route.fulfill({ json: { ...idea, starCount: Math.max(idea.starCount - 1, 0) } })
    }
  })

  await page.route('**/api/ideas/*', async (route) => {
    const id = Number(route.request().url().match(/\/api\/ideas\/(\d+)/)?.[1])
    const idea = MOCK_IDEAS.find((i) => i.id === id)
    if (!idea) {
      await route.fulfill({ status: 404, json: { message: 'Not found' } })
    } else {
      await route.fulfill({ json: idea })
    }
  })

  await page.route('**/api/ideas**', async (route) => {
    const url = new URL(route.request().url())
    const size = Number(url.searchParams.get('size') ?? 20)
    const p = Number(url.searchParams.get('page') ?? 0)
    const status = url.searchParams.get('status')
    const filtered = status ? MOCK_IDEAS.filter((i) => i.status === status) : MOCK_IDEAS
    await route.fulfill({
      json: {
        ...MOCK_PAGE,
        content: filtered.slice(p * size, p * size + size),
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
      },
    })
  })

  await page.route('**/api/admin/stats', async (route) => {
    await route.fulfill({ json: MOCK_ADMIN_STATS })
  })

  await page.route('**/api/auth/me', async (route) => {
    const email = role === 'ADMIN' ? 'admin@daybrew.local' : 'user@example.com'
    await route.fulfill({ json: { email, role } })
  })
}

export async function loginAsAdmin(page: Page) {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({ json: { token: 'mock-admin-token' } })
  })
  await mockCoreApi(page, 'ADMIN')
  await page.goto('/admin/login')
  await page.fill('input[type="text"]', 'admin')
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}

export async function loginAsUser(page: Page) {
  await mockCoreApi(page, 'USER')
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('daybrew_auth', '1')
    localStorage.setItem('daybrew_role', 'USER')
  })
  await page.goto('/dashboard')
}
