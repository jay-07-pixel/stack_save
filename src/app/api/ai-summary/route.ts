import { NextRequest, NextResponse } from "next/server";
import { AuditResult } from "@/types";

// Deterministic fallback — used when OpenAI API is unavailable
function generateFallbackSummary(result: AuditResult): string {
  const { totalMonthlySpend, totalMonthlySavings, recommendations, formData } = result;

  const actionableRecs = recommendations.filter((r) => r.type !== "keep");
  const topRec = actionableRecs.sort(
    (a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings
  )[0];

  if (!topRec || totalMonthlySavings === 0) {
    return `${formData.companyName}'s AI stack looks well-optimized at $${totalMonthlySpend}/month across ${formData.tools.length} tool${formData.tools.length !== 1 ? "s" : ""}. No significant savings opportunities were identified. We recommend a quarterly review as vendor pricing changes frequently.`;
  }

  const topAction = topRec.type === "downgrade"
    ? `downgrade ${topRec.toolName}`
    : topRec.type === "consolidate"
    ? `consolidate ${topRec.toolName} with an overlapping tool`
    : topRec.type === "switch_to_api"
    ? `switch ${topRec.toolName} to API access`
    : `negotiate ${topRec.toolName} pricing`;

  return `${formData.companyName} is currently spending $${totalMonthlySpend}/month across ${formData.tools.length} AI tool${formData.tools.length !== 1 ? "s" : ""}. Our audit identified $${totalMonthlySavings}/month ($${result.totalYearlySavings}/year) in potential savings.\n\nThe highest-impact action is to ${topAction}, which alone could save $${topRec.estimatedMonthlySavings}/month. ${actionableRecs.length > 1 ? `Combined with ${actionableRecs.length - 1} other recommendation${actionableRecs.length > 2 ? "s" : ""}, the total savings potential is $${totalMonthlySavings}/month.` : ""}\n\nImplementing these recommendations could free up meaningful budget for engineering or growth — with no reduction in AI capability.`;
}

export async function POST(req: NextRequest) {
  try {
    const result: AuditResult = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // No API key configured — use fallback
      return NextResponse.json({
        success: true,
        summary: generateFallbackSummary(result),
        source: "fallback",
      });
    }

    const { formData, recommendations, totalMonthlySpend, totalMonthlySavings, efficiencyScore } = result;

    const recSummary = recommendations
      .filter((r) => r.type !== "keep")
      .sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings)
      .slice(0, 5)
      .map((r) => `- ${r.toolName}: ${r.type.replace(/_/g, " ")} — save $${r.estimatedMonthlySavings}/month`)
      .join("\n");

    const prompt = `Audit data:
- Company: ${formData.companyName} (${formData.teamSize} people)
- Total monthly AI spend: $${totalMonthlySpend}
- Identified savings: $${totalMonthlySavings}/month (${result.savingsPercentage.toFixed(0)}%)
- Efficiency score: ${efficiencyScore}/100

Top recommendations:
${recSummary || "No major savings opportunities identified."}

Write a personalized 3-paragraph audit summary:
1. Current state assessment
2. Top 1-2 specific actions to take immediately  
3. Projected impact if recommendations are followed

Be direct. Use specific dollar amounts. No fluff.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a pragmatic CFO advisor helping startup founders reduce AI tooling costs. Write concise, direct audit summaries — no fluff, no hype. Use plain English. Cite specific dollar amounts. Maximum 3 short paragraphs.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error("Empty response from OpenAI");
    }

    return NextResponse.json({ success: true, summary, source: "ai" });
  } catch (error) {
    console.error("[POST /api/ai-summary]", error);

    // Graceful fallback — never return an error to the client for this endpoint
    try {
      const result: AuditResult = await req.clone().json();
      return NextResponse.json({
        success: true,
        summary: generateFallbackSummary(result),
        source: "fallback",
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to generate summary" },
        { status: 500 }
      );
    }
  }
}
