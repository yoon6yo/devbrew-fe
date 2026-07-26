# DevBrew FE — Design System

> Visual style: Superhuman (warm-light + cream) base + Mercury (action-only restraint) delta — warm cream canvas, single violet accent
> Functional requirements: DevBrew admin dashboard spec

## §1 Project Context

Two surfaces: (1) public **landing page** (`/`) — marketing, SEO-indexable, freemium CTA; (2) protected **admin dashboard** (`/dashboard`) — JWT-gated, idea management. Landing is warm-light: a parchment-cream canvas with a single disciplined violet accent — premium, calm, faintly mysterious, like a paper briefing with one drop of ink. Dashboard keeps data readability first. Concept: "매일 아침 커피 한 잔 같은 개발 아이디어 브리핑."

## §2 Palette

### Base (warm-light — landing)
| Token | Value | Tailwind equivalent | Usage |
|-------|-------|---------------------|-------|
| canvas | `#faf9f6` | `bg-[#faf9f6]` | Page background — warm cream |
| card | `#f3f0ec` | `bg-[#f3f0ec]` | Card / section surfaces |
| foreground | `#2a2433` | `text-[#2a2433]` | Headings — warm near-black, violet undertone |
| body | `#4a4458` | `text-[#4a4458]` | Body text, card content |
| muted | `#8b8398` | `text-[#8b8398]` | Meta, captions, timestamps |
| hairline | `#e8e0f0` | `border-[#e8e0f0]` | Default borders — faint violet tint |
| hairline-hover | `#d9cce8` | `hover:border-[#d9cce8]` | Hover border |
| accent | `#7c3aed` | `bg-[#7c3aed]` / `text-[#7c3aed]` | **Action only** — primary CTA, links, score bar, focus |
| accent-hover | `#6d28d9` | `hover:bg-[#6d28d9]` | Primary fill hover |
| accent-active | `#5b21b6` | `active:bg-[#5b21b6]` | Pressed |
| accent-wash | `rgba(124,58,237,0.08)` | `bg-[rgba(124,58,237,0.08)]` | Ghost hover, soft highlight fills |
| focus-ring | `rgba(124,58,237,0.25)` | `ring-[rgba(124,58,237,0.25)]` | 2px focus ring |

> **Accent discipline (Mercury principle):** `#7c3aed` appears only where the user acts — CTAs, links, focus, active states, score bar. Never decorative. One filled CTA per section. Visual interest comes from cream-surface contrast + `#2a2433` dark text + whitespace, not extra hues.
> **Neutral note (Mercury principle):** no warm grey. Every neutral carries a faint violet undertone. Never pure grey, never pure black (`#000000`) — `#2a2433` is warmer and softer.

### Status Colors (functional — keep from DevBrew spec)
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| NOTIFIED | `green-100` | `green-700` | `green-200` |
| SCORED | `blue-100` | `blue-700` | `blue-200` |
| PENDING | `amber-100` | `amber-700` | `amber-200` |
| REJECTED | `gray-100` | `gray-500` | `gray-200` |

### Track Colors (functional — keep from DevBrew spec)
| Track | Background | Text | Border |
|-------|-----------|------|--------|
| SAAS | `purple-100` | `purple-700` | `purple-200` |
| GITHUB | `#2a2433` | `white` | `#2a2433` |
| VIRAL | `orange-100` | `orange-700` | `orange-200` |

### Score Bar
| Range | Color |
|-------|-------|
| 8–10 | `green-500` |
| 6–7 | `text-[#7c3aed]` / `bg-[#7c3aed]` |
| 0–5 | `#e8e0f0` |

## §3 Typography (Pretendard Variable)

Font family: **Pretendard Variable** (`@fontsource/pretendard`)
Letter spacing: **-0.3px** on all text (`tracking-[-0.3px]`)

Weight-contrast strategy (Superhuman "compressed headline vs airy body" — reproduced in Pretendard): bold, tightly-led headlines against generous 1.6 line-height body.

| Role | Weight | Size | Line height |
|------|--------|------|-------------|
| Page title | 700 | `text-xl` (20px) | tight |
| Card title | 700 | `text-[15px]` | `leading-[15px]` |
| Modal heading | 700 | `text-[16px]` | `leading-6` |
| Score/count | 700 tabular-nums | `text-2xl` / `text-sm` | tight |
| Body (description, score reason) | 400 | `text-[15px]` | `leading-relaxed` (1.6) |
| Meta (date, label) | 400 | `text-[14px]` | `leading-[18px]` |
| Badge | 400 | `text-[14px]` | `leading-[18px]` |
| Action button | 700 | `text-[14px]` | `leading-[18px]` |

### Landing page typography (additional — not for dashboard)
| Role | Weight | Size | Line height |
|------|--------|------|-------------|
| Hero heading | 700 | `text-5xl` / `md:text-6xl` | `leading-[1.05]` (compressed) |
| Section heading | 700 | `text-3xl` | tight |
| Step number (decorative) | 700 | `text-4xl` color `#e8e0f0` | tight |
| Price | 700 | `text-3xl` | tight |
| Body (landing) | 400 | `text-base` | `leading-relaxed` (1.6, airy) |

## §4 Spacing & Radius

Spacing scale:
- xs: 6px → `gap-1.5` / `p-1.5`
- sm: 12px → `gap-3` / `p-3`
- md: 16px → `gap-4` / `p-4`
- lg: 20px → `gap-5` / `p-5`
- section (landing): 96px → `py-24` / `py-28` — generous band rhythm, "whitespace is a premium signal"

Radius scale (softened from Ohouse 4px toward Superhuman/Mercury):
- **Card**: `rounded-xl` (12px)
- **Badge**: `rounded-md` (6px)
- **Modal**: `rounded-xl` (12px)
- **Button (action)**: `rounded-lg` (8px)
- **Button (circular/floating)**: `rounded-full`
- **Input/select**: `rounded-lg` (8px)

Shadow (restrained — border containment first):
- Card hover: `hover:shadow-[0_4px_16px_rgba(124,58,237,0.08)]` — soft violet-tinted lift
- Floating: `shadow-[0_2px_8px_rgba(42,36,51,0.08)]`

## §5 Component States

Every data component must handle all four:
1. **loading** — skeleton `animate-pulse bg-[#f3f0ec]`
2. **empty** — centered `text-[#8b8398]` message
3. **error** — `text-[#7c3aed]` retry button
4. **success** — content rendered

## §6 Interactive States

- Card hover: `hover:border-[#d9cce8] hover:shadow-[0_4px_16px_rgba(124,58,237,0.08)] transition-all`
- Button (action filled): `bg-[#7c3aed] text-white hover:bg-[#6d28d9] active:bg-[#5b21b6]`
- Button (outlined secondary): `border border-[#e8e0f0] text-[#2a2433] hover:border-[#d9cce8]`
- Button (ghost): `text-[#7c3aed] hover:bg-[rgba(124,58,237,0.08)]`
- Button disabled: `disabled:opacity-30`
- Active tab: `bg-[#2a2433] text-white`
- Focus (global): `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,58,237,0.25)]`

## §7 Grid Layout

- Idea cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Summary cards: `grid-cols-2 md:grid-cols-4 gap-3`
- Landing container: `max-w-4xl mx-auto px-6` (Pricing `max-w-3xl`)

## §8 Animation

- Skeleton: `animate-pulse`
- Transitions: `transition-all` (hover, focus)
- No gradients — mystery comes from cream+violet contrast and whitespace, not motion or gradient washes.

## §9 Accessibility

- Close buttons: `aria-label="닫기"`
- Interactive cards: `role="article"`
- Score values: `tabular-nums`
- Focus ring visible on all interactive elements (`ring-[rgba(124,58,237,0.25)]`) — accent doubles as focus indicator, always visible.
- Cream `#faf9f6` bg vs `#2a2433` text ≈ 13:1 contrast (AAA). `#7c3aed` on cream ≈ 5.4:1 (AA for UI/large text).

## §10 Voice & Copy (Korean throughout)

- Status labels: NOTIFIED→"알림 완료", SCORED→"채점 완료", PENDING→"대기 중", REJECTED→"거절됨"
- Tab labels: 전체, 알림 완료, 채점 완료, 대기 중, 거절됨
- Empty state: "아직 아이디어가 없습니다."
- Error state: "데이터를 불러올 수 없습니다." + "다시 시도"
- Reject action: "거절" / pending: "처리 중…"
- Export button: "Top 5 내보내기" / loading: "준비 중…"
- Modal error: "아이디어 정보를 불러올 수 없습니다."
- Landing tone (Superhuman "confident, minimal" + Mercury "concrete, no hype"): declarative, calm, specific. No exclamation hype, no emoji. CTAs are verbs ("오늘의 아이디어 보기", "무료로 시작"). One bold claim per section.
