# METRICS.md — Key Metrics Framework

## North Star Metric

**Audits completed per week**

Why: A completed audit means a user entered real data and saw real results. It's the proxy for value delivered. Everything else (email captures, shares, return visits) is downstream of this.

---

## Acquisition Metrics

| Metric | Target (30-day post-launch) | Tracking method |
|---|---|---|
| Landing page visitors | 2,000 | Vercel Analytics |
| Audit page visits | 600 (30% conversion) | Vercel Analytics |
| Audits started | 400 (67% of audit page) | Custom event |
| Audits completed | 250 (62% completion) | Firestore count |
| Email captures | 100 (40% of completions) | Firestore |

---

## Activation Metrics

| Metric | Target | Definition |
|---|---|---|
| Time to first result | <3 min | From audit page load to results visible |
| Audit completion rate | >60% | Started → completed |
| Email capture rate | >35% | Completions that provide email |
| Report share rate | >15% | Completions that copy share URL |

---

## Engagement Metrics

| Metric | Target | Definition |
|---|---|---|
| Return visitor rate | >20% | Users who run a 2nd audit within 30 days |
| Share link click-through | >30% | Shared links that get at least 1 view |
| Email open rate | >40% | Email report delivery |

---

## Business Metrics (Post-Monetization)

| Metric | Formula |
|---|---|
| MRR | Active Pro subscribers × $29 |
| CAC | Total acquisition spend ÷ new paying customers |
| LTV | Avg monthly revenue × avg months retained |
| LTV:CAC | Target > 3:1 |
| Churn rate | Cancelled subscribers ÷ total subscribers |

---

## Audit Engine Quality Metrics

These measure whether our recommendations are actually useful:

| Metric | Target | Tracking method |
|---|---|---|
| "Keep" recommendations | <30% of total | Engine output analysis |
| Avg savings identified | >$200/month | Firestore aggregation |
| Recommendations with action items | 100% | Validation in engine |
| Fallback summary rate | <10% | API error logging |

A high "keep" rate means our audit is not finding problems — either the tool catalog is too narrow or the rules need refinement.

---

## Anti-Metrics (Things We Don't Optimize For)

- **Page views** — vanity metric. We care about audits, not visits.
- **Time on site** — if someone completes an audit in 90 seconds and gets value, that's a success.
- **Social media followers** — distribution, yes; follower count, no.

---

## Instrumentation Plan

### Phase 1 (Free tools)
- Vercel Analytics for page views and Web Vitals
- Firestore document counts for audit metrics
- Manual weekly review of Firestore data

### Phase 2 (Post 500 users)
- PostHog (open-source) for event tracking
- Track: audit_started, tool_added, audit_submitted, email_captured, share_copied, report_viewed
- Weekly dashboard review

### Phase 3 (Post monetization)
- Stripe for revenue metrics
- ChartMogul or Baremetrics for MRR/churn dashboards
