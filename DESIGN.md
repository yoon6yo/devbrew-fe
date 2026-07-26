# DevBrew FE — Design System

## §1 Project Context

Admin-only data dashboard. No public users. Clean light theme. Data readability first.

## §2 Palette

### Base
| Token | Value | Usage |
|-------|-------|-------|
| surface | zinc-50 | Page background |
| card | white | Card/panel background |
| border | zinc-200 | Default border |
| border-hover | zinc-300 | Hover border |
| text-primary | zinc-900 | Headings, labels |
| text-secondary | zinc-500 | Meta, captions |
| text-muted | zinc-400 | Timestamps, placeholders |

### Status Colors
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| NOTIFIED | green-100 | green-700 | green-200 |
| SCORED | blue-100 | blue-700 | blue-200 |
| PENDING | amber-100 | amber-700 | amber-200 |
| REJECTED | gray-100 | gray-500 | gray-200 |

### Track Colors
| Track | Background | Text | Border |
|-------|-----------|------|--------|
| SAAS | purple-100 | purple-700 | purple-200 |
| GITHUB | neutral-900 | white | neutral-700 |
| VIRAL | orange-100 | orange-700 | orange-200 |

### Score Bar
| Range | Color |
|-------|-------|
| 8–10 | green-500 |
| 6–7 | blue-500 |
| 0–5 | gray-300 |

## §3 Typography

| Role | Weight | Size |
|------|--------|------|
| Page title | font-bold | text-xl |
| Card title | font-semibold | text-sm |
| Modal heading | font-bold | text-lg |
| Score/count | font-bold tabular-nums | text-2xl / text-sm |
| Body (score reason, description) | normal | text-sm leading-relaxed |
| Meta (date, label) | normal | text-xs |
| Badge | font-medium | text-xs |

## §4 Spacing & Radius

- Card radius: rounded-xl
- Badge radius: rounded
- Modal radius: rounded-2xl
- Card padding: p-4
- Modal padding: p-6
- Page max-width: max-w-5xl

## §5 Component States

Every data component must handle:
1. **loading** — skeleton (animate-pulse, bg-zinc-100)
2. **empty** — centered message text-zinc-400
3. **error** — retry button (text-blue-600)
4. **success** — content rendered

## §6 Interactive States

- Card hover: `hover:border-zinc-300 hover:shadow-sm transition-all`
- Button disabled: `disabled:opacity-30`
- Active tab: `bg-zinc-900 text-white`

## §7 Grid Layout

- Idea cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Summary cards: `grid-cols-2 md:grid-cols-4 gap-3`

## §8 Animation

- Skeleton: `animate-pulse`
- Transitions: `transition-all`

## §9 Accessibility

- Close buttons: `aria-label="닫기"`
- Interactive cards: `role="article"`
- Score values: `tabular-nums` for alignment

## §10 Voice & Copy

- Korean UI copy throughout
- Empty state: "아직 아이디어가 없습니다."
- Error state: "데이터를 불러올 수 없습니다." + "다시 시도"
- Reject action: "거절" / pending: "처리 중…"
- Export button: "Top 5 Export" / loading: "준비 중…"
