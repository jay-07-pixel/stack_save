# PRICING_DATA.md — Verified Pricing Sources

All pricing used in StackSave's audit engine is sourced from official vendor pricing pages.
Prices are approximate and may lag real-time changes. Always verify before making budget decisions.

Last verified: May 2025

---

## GitHub Copilot

| Plan | Price | Source |
|---|---|---|
| Individual | $10/seat/month | [github.com/features/copilot](https://github.com/features/copilot) |
| Business | $19/seat/month | Same |
| Enterprise | $39/seat/month | Same |

Notes: Individual billed $100/year if annual.

---

## Cursor

| Plan | Price | Source |
|---|---|---|
| Hobby | Free | [cursor.com/pricing](https://cursor.com/pricing) |
| Pro | $20/seat/month | Same |
| Business | $40/seat/month | Same |

---

## ChatGPT / OpenAI

| Plan | Price | Source |
|---|---|---|
| Free | $0 | [openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing) |
| Plus | $20/seat/month | Same |
| Team | $25/seat/month (min 2 seats) | Same |
| Enterprise | Custom (est. $60+/seat) | Sales-only |

API pricing (GPT-4o, as of Q1 2025):
- Input: $2.50 / 1M tokens
- Output: $10.00 / 1M tokens
- Blended estimate: ~$5/1M tokens (assuming 60% input, 40% output)

Source: [openai.com/api/pricing](https://openai.com/api/pricing)

---

## Claude / Anthropic

| Plan | Price | Source |
|---|---|---|
| Free | $0 | [claude.ai/pricing](https://claude.ai/pricing) |
| Pro | $20/seat/month | Same |
| Team | $25/seat/month | Same |
| Enterprise | Custom | Sales-only |

API pricing (Claude 3.5 Sonnet, as of Q1 2025):
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens
- Blended estimate: ~$7/1M tokens

Source: [anthropic.com/api](https://www.anthropic.com/api)

---

## Gemini / Google

| Plan | Price | Source |
|---|---|---|
| Free | $0 | [gemini.google.com](https://gemini.google.com) |
| Advanced | $19.99/month | Same |
| Business (Workspace) | $20/seat/month | [workspace.google.com/pricing](https://workspace.google.com/pricing) |

API pricing (Gemini 1.5 Flash, as of Q1 2025):
- Input: $0.075 / 1M tokens (under 128k context)
- Output: $0.30 / 1M tokens
- Blended estimate: ~$1.25/1M tokens

---

## Notion AI

| Plan | Price | Source |
|---|---|---|
| Add-on | $10/seat/month | [notion.so/pricing](https://www.notion.so/pricing) |
| Business (bundled) | Included at $20/seat | Same |

---

## Jasper

| Plan | Price | Source |
|---|---|---|
| Creator | $49/month (1 user) | [jasper.ai/pricing](https://www.jasper.ai/pricing) |
| Pro | $69/month (1 user, more features) | Same |
| Business | Custom | Sales-only |

---

## Grammarly

| Plan | Price | Source |
|---|---|---|
| Free | $0 | [grammarly.com/plans](https://www.grammarly.com/plans) |
| Premium | ~$12/month (billed annually) | Same |
| Business | $15/seat/month | Same |

---

## Perplexity

| Plan | Price | Source |
|---|---|---|
| Free | $0 | [perplexity.ai/pricing](https://www.perplexity.ai/pricing) |
| Pro | $20/month | Same |

---

## Intercom Fin (AI Agent)

| Plan | Price | Source |
|---|---|---|
| Starter | ~$29/seat/month | [intercom.com/pricing](https://www.intercom.com/pricing) |
| Pro | ~$85/seat/month | Same |

Notes: Fin AI adds $0.99/resolution on top of seat pricing in some plans.

---

## Methodology Notes

1. All prices are monthly, per-seat unless otherwise specified
2. Annual billing discounts are noted where material (typically 15-20%)
3. Enterprise pricing is estimated based on public reports and G2 reviews
4. "Blended" API estimates assume a mix of input/output tokens typical of chat workloads
5. Prices are verified at time of writing and subject to change

## Update Protocol

When vendor pricing changes:
1. Update `src/config/tools.ts` with new plan objects
2. Update this file with new prices and date
3. Commit with: `docs: update pricing data for [vendor] — verified [date]`
