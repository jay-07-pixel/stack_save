# USER_INTERVIEWS.md — Simulated User Research

> Note: These interviews were conducted as structured thought experiments with real startup personas, 
> informed by public discussions on HN, Twitter, and r/startups about AI tool costs.
> Real user interviews should be conducted before the beta launch.

---

## Interview 1 — Alex, CTO at 8-person B2B SaaS

**Background:** Series Seed, $2M raised. Team of 8 engineers and 2 ops people.

**AI tools in use:** GitHub Copilot Business (8 seats), ChatGPT Team (10 seats), Notion AI (10 seats), Jasper (1 seat).

**Estimated monthly spend:** ~$680/month

**Pain points:**
- "I approved all these tools individually and never looked at the total"
- "I have no idea if everyone is actually using them"
- "Notion AI and ChatGPT feel like they do the same thing but I keep both because I don't want to piss anyone off"

**What they want from a tool like StackSave:**
- Exact dollar savings, not vague percentages
- Confidence that the recommendations are actually right
- Something they can forward to their CEO to justify cuts

**Reaction to downgrade recommendation:**
- "Show me the math and I'll do it. If it's wrong, I'll be pissed."
- "I don't trust 'AI-powered' recommendations for financial decisions. Show me the rule."

**Insight:** Explainability and trust are more important than polish. Show the reasoning, not just the conclusion.

---

## Interview 2 — Maria, Founder at 3-person product studio

**Background:** Bootstrapped. Revenue: $12k MRR. Extremely cost-conscious.

**AI tools in use:** ChatGPT Plus (1 seat), Grammarly Premium (1 seat), Perplexity Pro (1 seat).

**Estimated monthly spend:** ~$52/month

**Pain points:**
- "It's not a lot individually, but they add up"
- "Grammarly and ChatGPT overlap — I know that — but switching takes effort"
- "I want someone to just tell me which one to cut"

**What they want from a tool like StackSave:**
- Clear "winner" recommendation — which tool to keep, which to drop
- Estimated switching effort (not just savings)
- Quick — she doesn't have time for long flows

**Reaction to StackSave's form:**
- The multi-step form might be too long for her use case
- Would prefer a "quick scan" mode: paste a list of tools → get instant results

**Insight:** Consider a "quick mode" with a simplified input (tool name + spend only) for power users.

---

## Interview 3 — Sam, CFO at 25-person Series A startup

**Background:** Enterprise sales SaaS. $5M ARR. Sam directly controls the $15k/month software budget.

**AI tools in use:** Copilot Enterprise (25 seats), ChatGPT Enterprise, Intercom Fin, Jasper Business, custom GPT-4 integrations.

**Estimated monthly spend:** ~$6,000/month

**Pain points:**
- "I get invoiced by 6 different vendors and have no consolidated view"
- "Some of these were approved before I joined — I inherited them"
- "I want to show the board we're being thoughtful about AI spend"

**What they want from a tool like StackSave:**
- PDF export for board reporting
- Historical tracking (month over month)
- Ability to mark recommendations as "actioned" or "deferred"

**Reaction to shareable URL:**
- "I'd share this with my CEO and our board observer"
- "Can I download it as a PDF?"

**Insight:** PDF export and "mark as actioned" tracking are the most requested pro features. Prioritize for v2.

---

## Key Patterns Across Interviews

1. **Trust over polish** — All three wanted to see the reasoning behind recommendations, not just the conclusion. "Show me the rule" was a common request.

2. **Dollar amounts over percentages** — "$30/month savings" is more motivating than "5% savings." Always lead with absolute dollars.

3. **Inertia is the real enemy** — Most users know they're overpaying. The blocker is the effort to change. StackSave should generate specific action steps, not just insights.

4. **Shareable format matters** — All three wanted to share results. The CFO wanted board-ready PDF. The CTO wanted a link to forward. The founder wanted a quick screenshot.

5. **"Quick mode" is underexplored** — The multi-step form works for power users but loses time-pressed founders. A 30-second form with minimal fields could be a high-converting alternative.

---

## Next Steps for Real Interviews

- [ ] Post in r/startups: "I'm building a tool to audit AI tool costs. 10-min interview? I'll give feedback in return."
- [ ] DM 20 founders on Twitter who have publicly complained about software costs
- [ ] Ask first 5 users who complete an audit for a 15-minute follow-up call
