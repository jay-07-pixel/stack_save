# ECONOMICS.md — Unit Economics & Monetization

## Current State: Free Tool

StackSave is free for the MVP. The cost to run is near-zero.

### Infrastructure costs (monthly, at 1,000 audits/month)

| Item | Cost |
|---|---|
| Vercel (Hobby tier) | $0 |
| Firebase Firestore (free tier: 50k reads, 20k writes/day) | $0 |
| Resend (free tier: 3,000 emails/month) | $0 |
| OpenAI API (GPT-4o, ~500 tokens/summary × 1,000 audits) | ~$2.50 |
| **Total** | **~$2.50/month** |

At 10,000 audits/month:
- Firebase: ~$5-10/month (exceeds free tier)
- OpenAI: ~$25/month
- Resend: ~$20/month (paid tier at 50k emails)
- **Total: ~$50-60/month**

This is a very favorable unit economics profile for a free tool.

---

## Monetization Tiers

### Free (current)
- Unlimited audits
- Shareable report URL
- Email report delivery
- AI summary

### StackSave Pro — $29/month
Target: startup CTOs who run audits monthly
- Audit history dashboard
- Month-over-month savings tracking
- CSV/PDF export
- Slack notification when new pricing data detected
- Up to 5 team members

### StackSave Teams — $99/month
Target: ops leads at 20-100 person companies
- Unlimited team members
- Custom tool catalog (add proprietary tools)
- API access for programmatic auditing
- Priority support
- Quarterly pricing data refresh guarantee

### StackSave Enterprise — Custom (est. $500-2000/month)
Target: Series B+ companies, CFO office
- White-label reports
- Salesforce/Notion integration
- Dedicated account manager
- SLA

---

## Path to $10k MRR

| Step | Customers | Price | MRR |
|---|---|---|---|
| 100 Pro subscribers | 100 | $29 | $2,900 |
| 30 Teams subscribers | 30 | $99 | $2,970 |
| 5 Enterprise deals | 5 | $800 avg | $4,000 |
| **Total** | | | **$9,870** |

**Time estimate:** 6-12 months post-launch with consistent distribution.

---

## LTV / CAC Estimate

- **CAC (organic):** ~$0 (SEO + word-of-mouth)
- **CAC (paid):** ~$30-60 via LinkedIn targeted at CTOs
- **Avg contract value (Pro):** $29/month × 8 months avg retention = **$232 LTV**
- **LTV:CAC ratio (paid):** 3.8:1 — viable but tight. Focus on organic first.

---

## Key Risks

1. **OpenAI API cost spike** — If GPT-4o prices increase, the AI summary feature becomes expensive at scale. Mitigation: cache identical inputs, add rate limiting, make summary optional.

2. **Firebase cost cliff** — Firestore free tier has daily write limits. At viral scale, costs jump. Mitigation: batch writes, purge audits older than 90 days.

3. **Resend pricing** — 3,000 emails/month free, then $20/month for 50k. Manageable.

4. **Pricing data staleness** — If we're recommending downgrades based on wrong prices, trust erodes. Mitigation: quarterly pricing audits, versioned pricing data, disclaimer in reports.
