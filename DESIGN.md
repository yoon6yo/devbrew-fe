# DevBrew FE — Design System

> Visual style: Ohouse (오늘의집) live-extract token reference (DESIGN_DN.md)
> Functional requirements: DevBrew admin dashboard spec

## §1 Project Context

Two surfaces: (1) public **landing page** (`/`) — marketing, SEO-indexable, freemium CTA; (2) protected **admin dashboard** (`/dashboard`) — JWT-gated, idea management. Shared Ohouse-inspired clean minimal theme — white canvas, dark neutrals, bright blue action. Data readability first.

## §2 Palette

### Base (Ohouse-extracted)
| Token | Value | Tailwind equivalent | Usage |
|-------|-------|---------------------|-------|
| canvas | `#ffffff` | `bg-white` | Page background, card surfaces |
| foreground | `#2f3438` | `text-[#2f3438]` | Headings, labels |
| body | `#424242` | `text-[#424242]` | Body text, card content |
| muted | `#828c94` | `text-[#828c94]` | Meta, captions, timestamps |
| hairline | `#e0e0e0` | `border-[#e0e0e0]` | Default borders |
| hairline-hover | `#c8c8c8` | `hover:border-[#c8c8c8]` | Hover border |
| action | `#00a1ff` | `bg-[#00a1ff]` / `text-[#00a1ff]` | Primary action, links |
| page-bg | `#f8f8f8` | `bg-[#f8f8f8]` | Page background (off-white) |

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
| GITHUB | `#2f3438` | `white` | `#2f3438` |
| VIRAL | `orange-100` | `orange-700` | `orange-200` |

### Score Bar
| Range | Color |
|-------|-------|
| 8–10 | `green-500` |
| 6–7 | `text-[#00a1ff]` / `bg-[#00a1ff]` |
| 0–5 | `#e0e0e0` |

## §3 Typography (Ohouse — Pretendard Variable)

Font family: **Pretendard Variable** (`@fontsource/pretendard`)
Letter spacing: **-0.3px** on all text (`tracking-[-0.3px]`)

| Role | Weight | Size | Line height |
|------|--------|------|-------------|
| Page title | 700 | `text-xl` (20px) | tight |
| Card title | 700 | `text-[15px]` | `leading-[15px]` |
| Modal heading | 700 | `text-[16px]` | `leading-6` |
| Score/count | 700 tabular-nums | `text-2xl` / `text-sm` | tight |
| Body (description, score reason) | 400 | `text-[15px]` | `leading-[15px]` |
| Meta (date, label) | 400 | `text-[14px]` | `leading-[18px]` |
| Badge | 400 | `text-[14px]` | `leading-[18px]` |
| Action button | 700 | `text-[14px]` | `leading-[18px]` |

## §4 Spacing & Radius (Ohouse)

Spacing scale (Ohouse-observed):
- xs: 6px → `gap-1.5` / `p-1.5`
- sm: 12px → `gap-3` / `p-3`
- md: 16px → `gap-4` / `p-4`
- lg: 20px → `gap-5` / `p-5`

Radius scale:
- **Card**: `rounded` (4px) — Ohouse utility corner
- **Badge**: `rounded` (4px)
- **Modal**: `rounded` (4px)
- **Button (action)**: `rounded` (4px)
- **Button (circular/floating)**: `rounded-full` (24px)
- **Input/select**: `rounded` (4px)

Shadow:
- Floating: `shadow-[0_2px_5px_rgba(63,71,77,0.15)]`
- Card hover: `hover:shadow-[0_2px_5px_rgba(63,71,77,0.15)]`

## §5 Component States

Every data component must handle all four:
1. **loading** — skeleton `animate-pulse bg-[#e0e0e0]`
2. **empty** — centered `text-[#828c94]` message
3. **error** — `text-[#00a1ff]` retry button
4. **success** — content rendered

## §6 Interactive States

- Card hover: `hover:border-[#c8c8c8] hover:shadow-[0_2px_5px_rgba(63,71,77,0.15)] transition-all`
- Button (action filled): `bg-[#00a1ff] text-white hover:bg-[#0090e8]`
- Button (outlined utility): `border border-[#e0e0e0] text-[#2f3438] hover:border-[#c8c8c8]`
- Button disabled: `disabled:opacity-30`
- Active tab: `bg-[#2f3438] text-white`

## §7 Grid Layout

- Idea cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Summary cards: `grid-cols-2 md:grid-cols-4 gap-3`

## §8 Animation

- Skeleton: `animate-pulse`
- Transitions: `transition-all`

## §9 Accessibility

- Close buttons: `aria-label="닫기"`
- Interactive cards: `role="article"`
- Score values: `tabular-nums`

## §10 Voice & Copy (Korean throughout)

- Status labels: NOTIFIED→"알림 완료", SCORED→"채점 완료", PENDING→"대기 중", REJECTED→"거절됨"
- Tab labels: 전체, 알림 완료, 채점 완료, 대기 중, 거절됨
- Empty state: "아직 아이디어가 없습니다."
- Error state: "데이터를 불러올 수 없습니다." + "다시 시도"
- Reject action: "거절" / pending: "처리 중…"
- Export button: "Top 5 내보내기" / loading: "준비 중…"
- Modal error: "아이디어 정보를 불러올 수 없습니다."
