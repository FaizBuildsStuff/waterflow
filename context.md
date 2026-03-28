# Waterflow — Project Context

> This file serves as the single source of truth for the Waterflow project.
> Use it as AI prompt context, developer onboarding reference, and project overview.

---

## 1. What is Waterflow?

Waterflow is an AI-powered productivity SaaS web application. It is a unified workspace where individuals, freelancers, and small teams manage projects, get AI-assisted task breakdowns, collaborate in real time, and receive automated daily progress digests — all in one place.

**Tagline:** *Work that flows like water.*

The core idea: work should feel effortless and continuous, like water finding its path. The AI layer removes friction — it thinks, plans, and nudges so users stay in flow state instead of getting stuck organizing.

---

## 2. Target Users

| Segment | Use case |
|---|---|
| Solo professionals / freelancers | Personal task management, AI goal breakdown, time tracking |
| Small teams (2–20 people) | Sprint planning, task assignment, collaboration, digests |
| Small businesses / SMBs | Client project management, SOPs, onboarding workflows |

The product works for all three without separate products — same codebase, different plan limits.

---

## 3. Core Value Propositions

1. **AI task breakdown** — Type a goal, get actionable subtasks with time estimates instantly.
2. **Daily AI digest** — Every morning, users get a smart summary: what's due, what's blocked, what's overdue.
3. **Unified workspace** — Kanban board, list view, time tracking, collaboration, and automation — no switching tools.
4. **Flow automation** — Auto-move stale tasks, send reminders, close completed items without manual work.
5. **Zero learning curve** — Familiar patterns (Kanban, comments, assignments) enhanced by AI, not replaced.

---

## 4. Branding & Design System

### Identity
- **Name:** Waterflow
- **Theme:** Water — fluid, calm, powerful, modern
- **Tone:** Clean, confident, minimal. Not corporate. Not playful. Refined and purposeful.

### Typography
- **Font:** Satoshi (via Fontshare)
- **Weights used:** 401 (regular), 500 (medium), 700 (bold)
- **Load URL:**
  ```
  https://api.fontshare.com/v2/css?f[]=satoshi@401,500,700&display=swap
  ```
- **CSS variable:** `font-family: 'Satoshi', sans-serif`

### Color Tokens (from `colors.ts`)

| Token | Value | Usage |
|---|---|---|
| `bgPage` | `#f7f8fa` | Main page background |
| `bgSurface` | `#ffffff` | Cards, panels, modals |
| `textPrimary` | `#1a1d23` | Headings, bold labels |
| `textBody` | `#4a4f5a` | Body copy |
| `textMuted` | `#9ba0ab` | Placeholders, helper text |
| `brand` | `#1a7fe0` | Primary blue — CTAs, links, active states |
| `brandHover` | `#1265c0` | CTA hover |
| `accent` | `#1abcaa` | Teal — secondary highlights, badges |
| `borderDefault` | `#e8eaee` | Card borders, inputs |

### Design Principles
- White background, black text — never harsh, always slightly soft (`#f7f8fa` not pure white)
- Water-themed SVG animations: waves, droplets, ripples, floating particles
- Flat, no heavy shadows — subtle `box-shadow` only for elevation cues
- GSAP for entrance animations and scroll parallax
- CSS keyframes for continuous water motion (waves, drops, ripples)
- Responsive-first — mobile, tablet, desktop all handled

---

## 5. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.0 (App Router) |
| Styling | Tailwind CSS (v4) |
| UI Components | shadcn/ui |
| Animations | GSAP + ScrollTrigger, CSS keyframes |
| Font | Satoshi via Fontshare API |
| Language | TypeScript |
| Backend | Node.js (App Router APIs) |
| Database | PostgreSQL (via NeonDB / `postgres` js) |
| Auth | Custom JWT + HTTP-only cookies (`jose`) |
| AI layer | OpenAI API (GPT-4o mini) |
| Payments | Stripe Billing (planned) |
| Email | Resend (planned) |
| Hosting | Vercel |

---

## 6. Project Structure

```
waterflow/
├── app/
│   ├── layout.tsx           # Root layout — Satoshi font, Waterflow metadata
│   ├── page.tsx             # Landing page (Hero + Features + Pricing + Footer)
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/
│   │   ├── layout.tsx       # Dashboard shell (sidebar + topbar)
│   │   ├── dashboard/       # Main dashboard & project views
│   │   ├── tasks/
│   │   ├── team/
│   │   └── settings/
│   └── api/
│       ├── ai/              # OpenAI API routes
│       ├── tasks/
│       ├── projects/
│       └── auth/            # Auth & session management
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx  # ✅ Built — water SVG, GSAP, stats
│   ├── dashboard/
│   │   ├── sidebar.tsx      # ✅ Built — workspace switcher
│   │   ├── kanban-board.tsx # ✅ Built — 4 column board
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── auth.ts              # JWT handlers
│   ├── db.ts                # Postgres client
│   └── migrations.ts        # DB schema migrations
├── public/
│   └── assets/
└── context.md               # ✅ This file
```

---

## 7. Pricing Model

| Plan | Price | Limits | Target |
|---|---|---|---|
| Free | $0/mo | 1 project, 3 members, basic views | Acquisition / top of funnel |
| Pro | $12/mo | Unlimited projects, AI features, time tracking, digest | Individual power users |
| Team | $29/mo | Up to 10 seats, automation, priority support | Small teams |

- Stripe handles subscription billing
- Plan limits enforced via middleware on API routes
- Upgrade prompts shown contextually when limits are hit (not nag banners)

---

## 8. AI Integration

### Claude API usage
- **Model:** `claude-haiku-4-5` for real-time features (task breakdown, digest), `claude-sonnet-4-6` for heavier analysis
- **Task breakdown prompt pattern:**
  ```
  Given the goal: "{user_goal}", break it down into 4-8 concrete, actionable subtasks.
  For each subtask include: title, estimated time in minutes, priority (high/medium/low).
  Return as JSON array.
  ```
- **Daily digest prompt pattern:**
  ```
  Given these tasks for user {name}: {tasks_json}
  Write a short, motivating morning digest (3-5 sentences).
  Highlight: what's due today, any blockers, one encouragement.
  ```

### AI feature gates
- Task breakdown: Pro + Team only
- Daily digest: Pro + Team only
- Free users see a preview with upgrade prompt

---

## 9. MVP Build Plan

| Week | Focus | Deliverables |
|---|---|---|
| 1 | Foundation | Auth, DB schema, project + task CRUD, Kanban UI |
| 2 | AI core | Claude API integration, task breakdown, digest emails |
| 3 | Collaboration + billing | Team invites, comments, Stripe subscriptions, plan limits |
| 4 | Polish + launch | Onboarding flow, landing page, ProductHunt prep |

### Components build status
- [x] Collaborative Workspaces & Project Sharing
- [x] Multi-View Dashboards (Kanban, List, Timeline)
- [x] AI Task Breakdown & Subtasks
- [x] Unified "My Tasks" & Team Management
- [x] Real-time Comments & Discussions
- [x] Slug-based Routing & Clean Navigation
- [x] Real-time Task Sync & Notifications
- [x] Interactive AI Wireframe Board
- [ ] Stripe billing (Planned)
- [ ] Daily AI digest (Planned)

---

## 10. Technical Architecture Updates

**Collaboration Model:**
Projects can be shared via email invitations. Members are added to `project_members` table. Permissions are checked at the API layer to ensure only workspace owners OR project members can access tasks.

**Multi-View Implementation:**
- **Kanban**: Drag-and-drop state management via `@dnd-kit`.
- **List-View**: High-density data table for bulk management.
- **Timeline**: Chronological roadmap with `date-fns` for live countdowns.

**AI Layer:**
Uses OpenAI `gpt-4o-mini` to decompose individual tasks into sub-logical units (subtasks), streamlining the flow for complex agency work.

---

## 11. Key Design Decisions

**Why Satoshi?**
Clean, geometric, modern — feels like a premium SaaS product without being cold. The `401` weight gives body text an unusually refined lightness that pairs well with the water theme.

**Why water theme?**
Water is the universal metaphor for flow, clarity, and effortless movement — exactly what we want users to feel. It gives us a rich visual language (waves, ripples, droplets, currents) without feeling forced.

**Why not a dark theme?**
White + light blue reads as clean, trustworthy, and professional. Dark themes work well for dev tools; productivity SaaS converts better on light. We can add a dark mode in v2.

**Why Claude API over OpenAI?**
Better instruction-following for structured JSON outputs, lower latency on Haiku, and better alignment with the product's ethos.

---

## 12. For AI Assistants (Prompt Context)

When helping build Waterflow, always:

- Use **Satoshi** font (`401` regular, `500` medium, `700` bold) — never Inter, Geist, or system fonts
- Use color tokens from `colors.ts` — primary brand is `#1a7fe0`, accent is `#1abcaa`, bg is `#f7f8fa`
- Keep backgrounds **light** — white surfaces (`#ffffff`) on a soft page bg (`#f7f8fa`)
- Text is **near-black** (`#1a1d23`) for headings, `#4a4f5a` for body
- Animations use **GSAP** for entrance/scroll, **CSS keyframes** for continuous effects
- Water motifs: waves, ripples, droplets, particles — SVG-based, subtle not garish
- Components are **Next.js 14 App Router**, TypeScript, Tailwind + inline style tokens
- shadcn/ui for base components, custom styles layered on top
- All components are `"use client"` when they use GSAP or React state
- Follow the file structure in Section 6 above
- Build status tracked in Section 9 — always check before building a component

---

*Last updated: initial project setup*
*Stack: Next.js 14 · TypeScript · Tailwind · GSAP · Claude API · Stripe · Supabase*