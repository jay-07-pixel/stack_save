import { NextRequest, NextResponse } from "next/server";
import { getAuditBySlug } from "@/lib/firestore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || slug.length > 20) {
      return NextResponse.json(
        { success: false, error: "Invalid slug" },
        { status: 400 }
      );
    }

    const audit = await getAuditBySlug(slug);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, audit });
  } catch (error) {
    console.error("[GET /api/audit/[slug]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit" },
      { status: 500 }
    );
  }
}
