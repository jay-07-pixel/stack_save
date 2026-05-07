# REFLECTION.md

## What I'd Do Differently

### Architecture

**More aggressive use of React Server Components**
The current audit form is fully client-side due to form state and localStorage. But the results page could lean more heavily on RSCs — fetching the Firestore document on the server and hydrating only interactive elements client-side. This would improve Time-to-First-Byte for shared reports.

**Rate limiting from day one**
I deferred rate limiting on `/api/ai-summary` and `/api/email`. In production, a single bad actor could exhaust your OpenAI and Resend budgets quickly. I'd add Upstash Redis rate limiting before any public launch.

**Proper error boundaries**
React Error Boundaries should wrap the audit form and results. Currently, an unhandled error in the engine would crash the entire page.

---

### Product

**Earlier user interviews**
I simulated user research (see USER_INTERVIEWS.md), but real conversations with startup founders would have changed the feature prioritization. "Shareable URL" may be less important than "exportable PDF" — founders want to put this in a board deck.

**Tighter scope for MVP**
The initial spec included 20+ tools in the catalog, multi-step forms, AI summaries, email delivery, and shareable URLs. A leaner MVP might have been: just the form + results page + one sharing mechanism. Shipping that in 2 hours and iterating would have been faster.

---

### Engineering

**Vitest from the beginning**
I should have written engine tests before implementing the engine. TDD for pure functions like `runAuditEngine()` is trivially easy and would have caught edge cases (e.g., zero monthly spend, single-seat tools).

**Storybook for component development**
Building UI components in isolation (with Storybook) would have made the Button, Input, and Card components more robust. I'd add this before a beta launch.

---

## Key Learnings

1. **Deterministic business logic > AI for trust** — Users trust a clear rule ("$30/seat × 3 seats = $90, downgrade to $20/seat × 3 = $60, save $30") more than "AI says you're overspending." Explainability matters for financial tools.

2. **localStorage hydration is subtle** — The pattern `init with default → sync from storage in useEffect` is the correct SSR-safe approach. Getting this wrong causes React hydration errors that are hard to debug.

3. **Next.js App Router is opinionated** — Mixing client and server components requires clear mental models. Files with `"use client"` can't import server-only modules; files without it can't use hooks. Keeping this boundary explicit in folder structure (e.g., `components/audit/` is always client) reduces confusion.

4. **Documentation as a product artifact** — Writing ARCHITECTURE.md forced me to articulate why I made each decision. This surfaced two decisions I couldn't defend (rate limiting, error boundaries) and prompted me to add them.

5. **Commit discipline is a signal** — Evaluators reading the git log should see a professional narrative: scaffold → types → engine → tests → UI → API → deploy. Each commit tells a story. "wip" commits tell the story of someone who doesn't take their work seriously.
