# StackSave — AI Spend Audit Platform

> Instant AI tooling cost audits for lean startups. Free. No account required.

[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)

## What is StackSave?

Most startups are overpaying for AI tools. Teams buy Team plans for 2 people. They subscribe to ChatGPT Plus and Jasper for the same use case. They pay per-seat when their usage volume would be cheaper via API.

StackSave is a free audit tool that takes your AI stack as input and returns:
- Prioritized savings recommendations with exact dollar figures
- Overlap detection across tools
- Downgrade and API-switch opportunities
- An AI-generated narrative summary of your situation
- A shareable public report URL

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui primitives |
| Forms | React Hook Form + Zod |
| Database | Firebase Firestore |
| Email | Resend |
| AI | OpenAI GPT-4o (summary only) |
| Testing | Vitest |
| Deployment | Vercel |

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/jay-07-pixel/stack_save.git
cd stack_save

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Firebase, Resend, and OpenAI keys

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

See `.env.example` for all required keys. Never commit `.env.local`.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase project config |
| `RESEND_API_KEY` | Email delivery via Resend |
| `OPENAI_API_KEY` | GPT-4o audit summary generation |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL for share links |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── audit/              # Multi-step audit form page
│   ├── r/[slug]/           # Shareable public audit report page
│   └── api/                # Server-side API handlers
│       ├── audit/          # Save audit to Firestore
│       ├── email/          # Send report via Resend
│       └── ai-summary/     # GPT-4o summary generation
├── components/
│   ├── audit/              # Audit form steps and result components
│   ├── landing/            # Homepage-specific sections
│   ├── layout/             # Header, Footer, shared wrappers
│   └── ui/                 # Primitive UI components (shadcn-style)
├── config/
│   └── tools.ts            # AI tool catalog with verified pricing
├── engine/
│   └── audit.ts            # Deterministic audit rules engine
├── hooks/
│   └── useLocalStorage.ts  # Hydration-safe localStorage hook
├── lib/
│   ├── firebase.ts         # Firebase app initialization
│   ├── firestore.ts        # Firestore read/write helpers
│   ├── schemas.ts          # Zod validation schemas
│   └── utils.ts            # Shared utility functions
└── types/
    └── index.ts            # TypeScript type definitions
```

---

## Audit Engine

The audit engine (`src/engine/audit.ts`) is **fully deterministic** — no AI, no randomness. It applies four rules:

1. **Team Plan Overkill** — detects when a Team/Business/Enterprise plan is used with few seats, recommends downgrade
2. **API Switch Opportunity** — when seat-based spend > $100/mo, calculates if direct API access is cheaper
3. **Tool Overlap** — identifies tools serving the same use case, recommends consolidation
4. **High Cost Per Seat** — flags tools over $40/seat/mo as negotiation candidates

See `ARCHITECTURE.md` for detailed engine documentation.

---

## Running Tests

```bash
npm run test
npm run test:coverage
```

See `TESTS.md` for test coverage documentation.

---

## Deployment

This app is Vercel-native. Push to `main` → auto-deploys.

```bash
vercel --prod
```

Set all environment variables in Vercel project settings before deploying.

---

## Documentation

| File | Contents |
|---|---|
| `ARCHITECTURE.md` | System design, data flow, tradeoff decisions |
| `DEVLOG.md` | Engineering diary — day-by-day decisions |
| `REFLECTION.md` | What I'd do differently, key learnings |
| `TESTS.md` | Testing strategy and coverage report |
| `PRICING_DATA.md` | Sources for all tool pricing data |
| `PROMPTS.md` | AI prompt design and rationale |
| `GTM.md` | Go-to-market strategy |
| `ECONOMICS.md` | Unit economics and monetization plan |
| `USER_INTERVIEWS.md` | Simulated user research and findings |
| `LANDING_COPY.md` | Copy variants and A/B test ideas |
| `METRICS.md` | Key metrics to track post-launch |

---

## License

MIT — see [LICENSE](LICENSE).
