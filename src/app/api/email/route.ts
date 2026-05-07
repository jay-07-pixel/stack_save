import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAuditBySlug } from "@/lib/firestore";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";

const emailRequestSchema = z.object({
  email: z.string().email(),
  auditId: z.string().min(8).max(20),
});

function buildEmailHtml(audit: Awaited<ReturnType<typeof getAuditBySlug>>) {
  if (!audit) return "";

  const actionableRecs = audit.recommendations
    .filter((r) => r.type !== "keep")
    .sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://stacksave.app";
  const shareUrl = `${appUrl}/r/${audit.shareSlug}`;

  const recsHtml = actionableRecs
    .map(
      (rec) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; color: #18181b;">${rec.toolName}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; color: #71717a;">${rec.type.replace(/_/g, " ")}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; font-weight: 600; color: #16a34a; text-align: right;">${formatCurrency(rec.estimatedMonthlySavings)}/mo</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin: 0; padding: 0; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; border: 1px solid #e4e4e7; overflow: hidden;">
    
    <div style="background: #18181b; padding: 24px 32px;">
      <div style="font-size: 20px; font-weight: 700; color: white;">StackSave</div>
      <div style="font-size: 14px; color: #a1a1aa; margin-top: 4px;">AI Spend Audit Report</div>
    </div>

    <div style="padding: 32px;">
      <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #09090b;">
        Your audit is ready, ${audit.formData.companyName}
      </h1>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #71717a;">
        Here's a summary of your AI spend audit and recommended savings.
      </p>

      <div style="display: grid; gap: 12px; margin-bottom: 32px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px;">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #16a34a; margin-bottom: 8px;">Monthly savings identified</div>
          <div style="font-size: 32px; font-weight: 700; color: #15803d;">${formatCurrency(audit.totalMonthlySavings)}</div>
          <div style="font-size: 13px; color: #16a34a; margin-top: 4px;">${formatCurrency(audit.totalYearlySavings)}/year</div>
        </div>
      </div>

      ${actionableRecs.length > 0 ? `
      <h2 style="font-size: 16px; font-weight: 600; color: #09090b; margin: 0 0 16px 0;">Recommendations</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa; padding-bottom: 8px;">Tool</th>
            <th style="text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa; padding-bottom: 8px;">Action</th>
            <th style="text-align: right; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa; padding-bottom: 8px;">Savings</th>
          </tr>
        </thead>
        <tbody>${recsHtml}</tbody>
      </table>
      ` : `<p style="color: #71717a; font-size: 14px;">Your AI stack appears well-optimized. No major savings opportunities were found.</p>`}

      ${audit.aiSummary ? `
      <div style="margin-top: 32px; padding: 20px; background: #fafafa; border-radius: 10px; border: 1px solid #e4e4e7;">
        <div style="font-size: 13px; font-weight: 600; color: #18181b; margin-bottom: 12px;">AI Summary</div>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #52525b; white-space: pre-wrap;">${audit.aiSummary}</p>
      </div>
      ` : ""}

      <div style="margin-top: 32px; text-align: center;">
        <a href="${shareUrl}" style="display: inline-block; background: #16a34a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View Full Report
        </a>
      </div>
    </div>

    <div style="padding: 20px 32px; border-top: 1px solid #f4f4f5; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
        Sent by StackSave · Pricing data is approximate. Verify with official vendor pages before making changes.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = emailRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const { email, auditId } = validation.data;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Email delivery not configured" },
        { status: 503 }
      );
    }

    const audit = await getAuditBySlug(auditId);
    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "StackSave <reports@stacksave.app>",
      to: email,
      subject: `Your AI spend audit — ${formatCurrency(audit.totalMonthlySavings)}/month in savings identified`,
      html: buildEmailHtml(audit),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/email]", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
