# PROMPTS.md — AI Prompt Design

## Context

AI is used in exactly one place: generating the personalized audit summary narrative.
This keeps AI costs low and results trustworthy (the actual numbers come from the deterministic engine, not AI).

---

## Audit Summary Prompt

**Endpoint:** `POST /api/ai-summary`

**Model:** `gpt-4o-mini` (balances quality vs. cost — at $0.15/1M input tokens, even 1,000 summaries/day costs <$1)

**System prompt:**
```
You are a pragmatic CFO advisor helping startup founders reduce their AI tooling costs.
You write concise, direct audit summaries — no fluff, no hype.
You use plain English. You cite specific dollar amounts.
You are helpful and constructive, not judgmental.
Maximum 3 short paragraphs.
```

**User prompt construction:**
```
Audit data:
- Company: {companyName} ({teamSize} people)
- Total monthly AI spend: ${totalMonthlySpend}
- Identified savings: ${totalMonthlySavings}/month (${savingsPercentage}%)
- Efficiency score: {efficiencyScore}/100

Top recommendations:
{recommendations.map(r => `- ${r.toolName}: ${r.type} — save $${r.estimatedMonthlySavings}/month`).join('\n')}

Write a personalized 3-paragraph audit summary:
1. Current state assessment
2. Top 1-2 specific actions to take immediately
3. Projected impact if recommendations are followed
```

---

## Design Decisions

### Why gpt-4o-mini over gpt-4o?
The summary is a narrative, not a complex reasoning task. GPT-4o-mini produces output that is indistinguishable from GPT-4o for this use case, at 15x lower cost. We only upgrade if quality complaints arise.

### Why a system prompt that limits to 3 paragraphs?
Long AI outputs are often not read. A tight constraint forces the model to be selective and concise — more useful to founders who are skimming.

### Why include the efficiency score in the prompt?
Without context, the model might write a generic summary. The efficiency score (e.g., 35/100) gives the model a "state of the patient" signal that shapes the tone.

---

## Fallback (No API Key)

If `OPENAI_API_KEY` is not set or the API call fails, we return a deterministic fallback:

```ts
function generateFallbackSummary(result: AuditResult): string {
  const { totalMonthlySpend, totalMonthlySavings, recommendations, formData } = result;

  const topRec = recommendations
    .filter(r => r.type !== 'keep')
    .sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings)[0];

  if (!topRec) {
    return `${formData.companyName}'s AI stack looks well-optimized at $${totalMonthlySpend}/month. No major savings opportunities were identified. We recommend a quarterly review as vendor pricing changes frequently.`;
  }

  return `${formData.companyName} is currently spending $${totalMonthlySpend}/month on AI tools. Our audit identified $${totalMonthlySavings}/month in potential savings — $${result.totalYearlySavings}/year. The highest-impact action is to ${topRec.type.replace(/_/g, ' ')} ${topRec.toolName}, which alone could save $${topRec.estimatedMonthlySavings}/month. Implementing these recommendations could free up meaningful budget for engineering or growth investments.`;
}
```

The fallback is grammatically correct, data-accurate, and useful — even without AI.

---

## Prompt Iteration Log

| Version | Change | Reason |
|---|---|---|
| v1 | Basic summary request | Initial implementation |
| v2 | Added system prompt with CFO persona | Output was too generic |
| v3 | Added 3-paragraph constraint | Output was too long |
| v4 | Added efficiency score to prompt | Tone calibration |
