# DEVLOG.md — Engineering Diary

A running log of decisions, blockers, and learnings during StackSave development.

---

## Day 1 — May 7, 2026

### Session goal
Bootstrap the project, establish architecture, ship the landing page.

### Decisions made

**Chose Next.js 15 App Router over Pages Router**
App Router enables React Server Components, which we'll use for the public shareable report page (`/r/[slug]`). The audit form itself is a Client Component due to its stateful nature.

**Chose Zod for validation over manual checks**
Zod gives us runtime safety on form inputs and API payloads with a single schema definition reused across client and server. The `auditFormSchema` in `src/lib/schemas.ts` is the single source of truth.

**Chose Firestore over Supabase**
Supabase requires more setup (row-level security, Postgres schema migrations). Firestore is schema-free, which suits the MVP iteration speed. We can migrate later with minimal changes isolated to `src/lib/firestore.ts`.

**Decided against a monorepo**
No separate backend service needed. Next.js API routes handle all server-side logic. Adding a monorepo would add complexity with no benefit at this scale.

### Files created
- `src/app/layout.tsx` — root layout with metadata
- `src/app/page.tsx` — marketing landing page
- `src/app/globals.css` — design tokens
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/` — button, input, label, badge, card
- `src/engine/audit.ts` — full deterministic audit rules engine
- `src/config/tools.ts` — AI tool catalog with pricing
- `src/lib/utils.ts`, `firebase.ts`, `firestore.ts`, `schemas.ts`
- `src/hooks/useLocalStorage.ts`
- `src/types/index.ts`

### Technical note on localStorage hydration
Next.js SSR means `window` is undefined on the server. The `useLocalStorage` hook initializes with `initialValue` on first render, then syncs from storage in a `useEffect`. This prevents hydration mismatches without needing `suppressHydrationWarning` on individual elements.

### Open questions for next session
- [ ] How should we handle the multi-step form UX? Wizard steps vs. single scrollable form?
- [ ] Should the audit page be a Server or Client Component? (Answer: Client, due to localStorage + form state)
- [ ] What should the audit results page look like? Prioritize savings summary or tool-by-tool breakdown?

---

## Upcoming

- [ ] Multi-step audit form with field persistence
- [ ] Audit results display (savings dashboard)
- [ ] Shareable report page (`/r/[slug]`)
- [ ] Firestore write on audit submission
- [ ] Email delivery with Resend
- [ ] AI summary via OpenAI API
- [ ] Vitest unit tests for engine
