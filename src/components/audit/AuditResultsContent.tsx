"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuditResultsDashboard } from "./AuditResultsDashboard";
import { Button } from "@/components/ui/button";
import { AuditResult } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AuditResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auditId = searchParams.get("id");

  const [result, setResult] = useState<AuditResult | null>(null);
  const [aiSummaryStatus, setAiSummaryStatus] = useState<
    "loading" | "done" | "failed"
  >("loading");

  useEffect(() => {
    const stored = sessionStorage.getItem("stacksave_current_audit");
    if (stored) {
      try {
        const parsed: AuditResult = JSON.parse(stored);
        setResult(parsed);
        fetchAiSummary(parsed);
      } catch {
        router.replace("/audit");
      }
    } else if (auditId) {
      fetchFromFirestore(auditId);
    } else {
      router.replace("/audit");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAiSummary(auditResult: AuditResult) {
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditResult),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setResult((prev) =>
            prev ? { ...prev, aiSummary: data.summary } : prev
          );
        }
      }
    } catch {
      // Non-critical — results are shown without summary
    } finally {
      setAiSummaryStatus("done");
    }
  }

  async function fetchFromFirestore(slug: string) {
    try {
      const res = await fetch(`/api/audit/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.audit);
        setAiSummaryStatus("done");
      } else {
        router.replace("/audit");
      }
    } catch {
      router.replace("/audit");
    }
  }

  if (!result) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
          <p className="text-sm text-zinc-500">Loading your audit...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 gap-1.5 text-zinc-400"
          >
            <Link href="/audit">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to audit
            </Link>
          </Button>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Audit results
            </h1>
            <div className="text-sm text-zinc-400">
              {result.formData.companyName} ·{" "}
              {new Date(result.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          {aiSummaryStatus === "loading" && !result.aiSummary && (
            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
              <span className="h-3 w-3 animate-spin rounded-full border border-zinc-300 border-t-zinc-600" />
              Generating AI summary...
            </div>
          )}
        </div>

        <AuditResultsDashboard result={result} />
      </div>
    </main>
  );
}
