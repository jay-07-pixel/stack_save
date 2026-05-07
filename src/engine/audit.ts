import {
  AuditFormData,
  AuditRecommendation,
  AuditResult,
  AuditToolEntry,
  RecommendationType,
} from "@/types";
import { findKnownTool } from "@/config/tools";
import { generateSlug } from "@/lib/utils";

// ─── Rule Thresholds ───────────────────────────────────────────────────────

const TEAM_PLAN_OVERKILL_SEAT_THRESHOLD = 3;
const HIGH_SPEND_PER_SEAT_THRESHOLD = 40; // USD/month
const API_SWITCH_MIN_SPEND = 100; // only recommend API if paying $100+/mo
const DUPLICATE_SIMILARITY_THRESHOLD = 2; // tools in same category

// ─── Recommendation Rules ──────────────────────────────────────────────────

function analyzeTeamPlanOverkill(
  tool: AuditToolEntry,
  teamSize: number
): Partial<AuditRecommendation> | null {
  const known = findKnownTool(tool.name);
  if (!known) return null;

  const teamPlan = known.plans.find((p) =>
    p.name.toLowerCase().includes("team") ||
    p.name.toLowerCase().includes("business") ||
    p.name.toLowerCase().includes("enterprise")
  );

  const individualPlan = known.plans.find((p) =>
    p.name.toLowerCase().includes("individual") ||
    p.name.toLowerCase().includes("pro") ||
    p.name.toLowerCase().includes("plus") ||
    p.name.toLowerCase().includes("creator")
  );

  const isOnExpensivePlan =
    teamPlan &&
    tool.plan.toLowerCase().includes(teamPlan.name.toLowerCase());

  if (
    isOnExpensivePlan &&
    tool.seats <= TEAM_PLAN_OVERKILL_SEAT_THRESHOLD &&
    individualPlan &&
    individualPlan.monthlyPerSeat < teamPlan.monthlyPerSeat
  ) {
    const currentMonthly = teamPlan.monthlyPerSeat * tool.seats;
    const cheaperMonthly = individualPlan.monthlyPerSeat * tool.seats;
    const savings = currentMonthly - cheaperMonthly;

    if (savings <= 0) return null;

    return {
      type: "downgrade" as RecommendationType,
      reason: `You're on a ${teamPlan.name} plan with only ${tool.seats} seat${tool.seats > 1 ? "s" : ""}. The ${individualPlan.name} plan at $${individualPlan.monthlyPerSeat}/seat covers the same core features for small teams.`,
      estimatedMonthlySavings: savings,
      confidence: "high",
      actionItems: [
        `Downgrade from ${teamPlan.name} to ${individualPlan.name} plan`,
        `Expected monthly saving: $${savings.toFixed(0)}`,
        "Review team admin features — verify none are business-critical before downgrading",
      ],
    };
  }

  return null;
}

function analyzeApiSwitchOpportunity(
  tool: AuditToolEntry
): Partial<AuditRecommendation> | null {
  const known = findKnownTool(tool.name);
  if (!known || !known.hasApiAccess) return null;
  if (tool.monthlySpend < API_SWITCH_MIN_SPEND) return null;
  if (!known.apiCostPer1MTokens) return null;

  // Estimate: $20/seat/month ≈ 4M tokens/month at typical GPT-4o usage patterns
  // API at $5/1M = $20 for equivalent usage, so breakeven is ~$20/seat
  // At higher volumes, API wins significantly
  const estimatedApiMonthly = tool.monthlySpend * 0.4; // API typically 40-60% of seat pricing at volume
  const savings = tool.monthlySpend - estimatedApiMonthly;

  if (savings < 20) return null;

  return {
    type: "switch_to_api" as RecommendationType,
    reason: `At $${tool.monthlySpend}/month, direct API access could be significantly cheaper. API pricing for ${tool.name} is usage-based and scales better for teams with predictable, high-volume workloads.`,
    estimatedMonthlySavings: Math.round(savings),
    confidence: "medium",
    actionItems: [
      `Audit actual monthly token consumption across your team`,
      `Compare: current seat cost vs. estimated API cost at your volume`,
      `Build or adopt a thin wrapper (e.g. Open WebUI, LibreChat) for team access`,
      `Estimated API cost benchmark: ~$${known.apiCostPer1MTokens}/1M tokens`,
    ],
  };
}

function analyzeOverlapOpportunity(
  tool: AuditToolEntry,
  allTools: AuditToolEntry[]
): Partial<AuditRecommendation> | null {
  const known = findKnownTool(tool.name);
  if (!known) return null;

  const sameUseCaseTools = allTools.filter((t) => {
    if (t.id === tool.id) return false;
    const otherKnown = findKnownTool(t.name);
    if (!otherKnown) return false;
    return otherKnown.useCases.some((uc) => known.useCases.includes(uc));
  });

  if (sameUseCaseTools.length < 1) return null;

  // Find the more expensive duplicate
  const isMoreExpensive = sameUseCaseTools.some(
    (t) => t.monthlySpend < tool.monthlySpend
  );

  if (!isMoreExpensive) return null;

  const cheaperAlternative = sameUseCaseTools.sort(
    (a, b) => a.monthlySpend - b.monthlySpend
  )[0];

  const savings = Math.round(tool.monthlySpend * 0.5); // conservative: eliminate one

  return {
    type: "consolidate" as RecommendationType,
    reason: `${tool.name} and ${cheaperAlternative.name} overlap significantly in use case (${known.useCases.join(", ")}). Consolidating to a single tool eliminates redundant spend.`,
    estimatedMonthlySavings: savings,
    confidence: "medium",
    actionItems: [
      `Audit which features your team actually uses in ${tool.name}`,
      `Evaluate if ${cheaperAlternative.name} covers 80%+ of those use cases`,
      `Run a 2-week trial consolidation and gather team feedback`,
      `Consider migrating workflows to the lower-cost option`,
    ],
    alternativeTool: cheaperAlternative.name,
  };
}

function analyzeHighCostPerSeat(
  tool: AuditToolEntry
): Partial<AuditRecommendation> | null {
  const costPerSeat = tool.seats > 0 ? tool.monthlySpend / tool.seats : 0;
  if (costPerSeat < HIGH_SPEND_PER_SEAT_THRESHOLD) return null;

  const known = findKnownTool(tool.name);
  const alternatives = known?.alternatives ?? [];

  return {
    type: "negotiate" as RecommendationType,
    reason: `At $${costPerSeat.toFixed(0)}/seat/month, ${tool.name} is above the efficient spend threshold of $${HIGH_SPEND_PER_SEAT_THRESHOLD}/seat. This tier typically warrants direct negotiation or contract review.`,
    estimatedMonthlySavings: Math.round(tool.monthlySpend * 0.15), // 15% negotiation discount is standard
    confidence: "low",
    actionItems: [
      "Request an annual commitment discount (typically 15-20% off)",
      "Ask for a nonprofit/startup rate if applicable",
      ...(alternatives.length > 0
        ? [`Compare pricing against alternatives: ${alternatives.join(", ")}`]
        : []),
      "Review usage data before renewal — are all seats active?",
    ],
  };
}

// ─── Main Audit Engine ─────────────────────────────────────────────────────

export function runAuditEngine(formData: AuditFormData): AuditResult {
  const recommendations: AuditRecommendation[] = [];

  for (const tool of formData.tools) {
    const toolRecs: AuditRecommendation[] = [];

    // Rule 1: Team plan overkill
    const teamOverkill = analyzeTeamPlanOverkill(tool, formData.teamSize);
    if (teamOverkill && teamOverkill.estimatedMonthlySavings! > 0) {
      toolRecs.push({
        toolId: tool.id,
        toolName: tool.name,
        currentMonthlyCost: tool.monthlySpend,
        ...teamOverkill,
      } as AuditRecommendation);
    }

    // Rule 2: API switch opportunity
    if (toolRecs.length === 0) {
      const apiSwitch = analyzeApiSwitchOpportunity(tool);
      if (apiSwitch && apiSwitch.estimatedMonthlySavings! > 0) {
        toolRecs.push({
          toolId: tool.id,
          toolName: tool.name,
          currentMonthlyCost: tool.monthlySpend,
          ...apiSwitch,
        } as AuditRecommendation);
      }
    }

    // Rule 3: Overlap / consolidation
    if (toolRecs.length === 0) {
      const overlap = analyzeOverlapOpportunity(tool, formData.tools);
      if (overlap && overlap.estimatedMonthlySavings! > 0) {
        toolRecs.push({
          toolId: tool.id,
          toolName: tool.name,
          currentMonthlyCost: tool.monthlySpend,
          ...overlap,
        } as AuditRecommendation);
      }
    }

    // Rule 4: High cost-per-seat — negotiation signal
    if (toolRecs.length === 0) {
      const highCost = analyzeHighCostPerSeat(tool);
      if (highCost && highCost.estimatedMonthlySavings! > 0) {
        toolRecs.push({
          toolId: tool.id,
          toolName: tool.name,
          currentMonthlyCost: tool.monthlySpend,
          ...highCost,
        } as AuditRecommendation);
      }
    }

    // Rule 5: No optimization found — keep and flag as efficient
    if (toolRecs.length === 0) {
      toolRecs.push({
        toolId: tool.id,
        toolName: tool.name,
        type: "keep",
        reason: `${tool.name} appears well-optimized at $${tool.monthlySpend}/month for ${tool.seats} seat${tool.seats !== 1 ? "s" : ""}. No significant savings opportunity identified.`,
        currentMonthlyCost: tool.monthlySpend,
        estimatedMonthlySavings: 0,
        confidence: "high",
        actionItems: ["Review quarterly to ensure seat utilization stays high"],
      });
    }

    recommendations.push(...toolRecs);
  }

  const totalMonthlySpend = formData.tools.reduce(
    (sum, t) => sum + t.monthlySpend,
    0
  );
  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.estimatedMonthlySavings,
    0
  );
  const totalYearlySavings = totalMonthlySavings * 12;
  const savingsPercentage =
    totalMonthlySpend > 0 ? (totalMonthlySavings / totalMonthlySpend) * 100 : 0;

  // Efficiency score: 0-100, inversely correlated with savings %
  const efficiencyScore = Math.max(0, Math.round(100 - savingsPercentage));

  return {
    id: generateSlug(16),
    createdAt: new Date().toISOString(),
    formData,
    recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalYearlySavings,
    savingsPercentage,
    efficiencyScore,
    shareSlug: generateSlug(10),
  };
}
