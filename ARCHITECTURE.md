# ARCHITECTURE.md

## System Design — StackSave

### Overview

StackSave is a stateless audit tool with optional persistence. The core user journey involves no authentication and no required backend — the audit engine runs client-side and produces a result that can optionally be persisted to Firestore for sharing.

---

## Request / Data Flow

```
User fills audit form
        │
        ▼
[Client] Zod validation (React Hook Form)
        │
        ▼
[Client] runAuditEngine() — deterministic rules, zero API calls
        │
        ▼
[Client] Display audit results locally (fast, offline-capable)
        │
        ├──► [API] /api/audit → save to Firestore → return shareSlug
        │
        ├──► [API] /api/ai-summary → OpenAI GPT-4o → personalized narrative
        │                          ← fallback: deterministic summary if API fails
        │
        └──► [API] /api/email → Resend → deliver PDF-like HTML report
```

---

## Key Architectural Decisions

### 1. Client-side audit engine

**Decision:** The audit rules engine runs entirely on the client (no server round-trip).

**Rationale:**
- Results appear instantly without waiting for a network call
- Resilient to backend outages — core product still works
- No latency, no cold starts
- Easier to unit test in isolation

**Tradeoff:** Pricing rules are visible in the JS bundle. Acceptable — the rules are transparent and could be publicly documented anyway.

---

### 2. Deterministic pricing rules, not AI

**Decision:** All savings calculations use explicit business logic, not LLM inference.

**Rationale:**
- Financially defensible numbers (not AI hallucinations)
- Predictable, testable, auditable
- Users can trust the math
- AI is only used where it adds unique value: personalized narrative prose

**Tradeoff:** Rules require manual updates as vendor pricing changes.

---

### 3. Firebase Firestore for persistence

**Decision:** Firestore for audit storage and share URLs.

**Rationale:**
- No server to manage
- Generous free tier — sufficient for MVP scale
- Realtime capability available if needed later
- Well-documented Next.js integration

**Tradeoff:** Vendor lock-in. Migration to Postgres would require adapters in `src/lib/firestore.ts`.

---

### 4. Share-by-slug pattern

**Decision:** Each audit gets a 10-char alphanumeric slug as its public identifier.

**Rationale:**
- Collision probability negligible at MVP scale (36^10 ≈ 3.6 trillion combinations)
- Clean URLs: `/r/abc1234xyz`
- No sequential IDs that reveal audit volume to competitors

---

### 5. localStorage for form persistence

**Decision:** Audit form state persists to localStorage via `useLocalStorage` hook.

**Rationale:**
- Users abandon forms. Their work is preserved across refreshes.
- No backend dependency for this feature
- Implemented with a hydration-safe pattern (init with default → sync from storage in useEffect)

**Tradeoff:** State is device-specific. Cross-device continuity not supported at MVP.

---

### 6. AI summary with graceful fallback

**Decision:** GPT-4o generates the narrative, but a deterministic fallback exists.

**Rationale:**
- OpenAI API can be slow or unavailable
- Graceful degradation keeps the product usable
- Fallback uses rule outputs to construct a readable, personalized summary

---

## Folder Architecture Rationale

```
src/engine/     — pure functions, zero side effects, easily testable
src/config/     — static data (tool catalog, pricing), not logic
src/lib/        — infrastructure adapters (Firebase, Resend, utils)
src/types/      — single source of truth for all types
src/hooks/      — stateful React hooks, abstracted for reuse
src/components/ — UI split by domain (audit, landing, layout, ui)
src/app/        — Next.js routes only; minimal logic, delegate to above
```

This separation allows any layer to be replaced independently. If we drop Firebase, only `src/lib/firestore.ts` changes. If we change the audit rules, only `src/engine/audit.ts` changes.

---

## Firestore Schema

```
Collection: audits
Document ID: <shareSlug> (10-char alphanumeric)

Fields:
  id              string    Internal UUID
  shareSlug       string    Public URL slug
  createdAt       string    ISO timestamp
  serverCreatedAt timestamp Firestore server timestamp
  formData        object    {companyName, teamSize, email, tools[]}
  recommendations object[]  [{toolId, type, savings, actionItems, ...}]
  totalMonthlySpend   number
  totalMonthlySavings number
  totalYearlySavings  number
  savingsPercentage   number
  efficiencyScore     number
  aiSummary       string?   Optional GPT-4o narrative
  viewCount       number    Incremented on each public view
```

---

## Security Considerations

- Email addresses are stored only in Firestore audit documents, never logged
- No auth required — audit results are public by share slug (intentional design)
- API routes validate all inputs with Zod before processing
- Firebase API keys are safe to expose client-side (security enforced via Firestore rules)
- OpenAI and Resend keys are server-only (`OPENAI_API_KEY`, `RESEND_API_KEY`)

---

## Scalability Notes (Post-MVP)

- At >10k audits/month, add a Firestore composite index on `createdAt` for admin queries
- Rate-limit `/api/ai-summary` with Upstash Redis if API costs spike
- Add a CDN layer (Vercel Edge) for shareable report pages (`/r/[slug]`)
- Consider migrating from Firestore to Turso (SQLite at the edge) for lower cost at scale
