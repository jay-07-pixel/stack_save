import { NextRequest, NextResponse } from "next/server";
import { saveAudit } from "@/lib/firestore";
import { AuditResult } from "@/types";
import { z } from "zod";

// Basic shape validation — the engine already produces valid data,
// but we validate here to prevent malformed writes from reaching Firestore
const auditResultSchema = z.object({
  id: z.string(),
  shareSlug: z.string().min(8).max(20),
  createdAt: z.string(),
  totalMonthlySpend: z.number().min(0),
  totalMonthlySavings: z.number().min(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = auditResultSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid audit data" },
        { status: 400 }
      );
    }

    const slug = await saveAudit(body as AuditResult);

    return NextResponse.json({ success: true, shareSlug: slug });
  } catch (error) {
    console.error("[POST /api/audit]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save audit" },
      { status: 500 }
    );
  }
}
