"use client";

import { useState, useCallback } from "react";
import { AuditResult } from "@/types";
import { RecommendationCard } from "./RecommendationCard";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Share2,
  Mail,
  Check,
  TrendingDown,
  DollarSign,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditResultsDashboardProps {
  result: AuditResult;
}

const EFFICIENCY_COLOR = (score: number) => {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

const EFFICIENCY_LABEL = (score: number) => {
  if (score >= 80) return "Well optimized";
  if (score >= 60) return "Room to improve";
  return "Significant waste detected";
};

export function AuditResultsDashboard({ result }: AuditResultsDashboardProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState(result.formData.email || "");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${result.shareSlug}`
      : `/r/${result.shareSlug}`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  }, [shareUrl]);

  const handleEmailReport = useCallback(async () => {
    if (!email) {
      setShowEmailInput(true);
      return;
    }

    setEmailStatus("sending");
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, auditId: result.shareSlug }),
      });

      if (res.ok) {
        setEmailStatus("sent");
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  }, [email, result.shareSlug]);

  const actionableRecs = result.recommendations.filter((r) => r.type !== "keep");
  const keepRecs = result.recommendations.filter((r) => r.type === "keep");

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <section aria-label="Savings summary">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
              Current monthly spend
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {formatCurrency(result.totalMonthlySpend)}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              Monthly savings
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(result.totalMonthlySavings)}
            </div>
            <div className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-500">
              {formatCurrency(result.totalYearlySavings)}/year
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
              Savings rate
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {formatPercent(result.savingsPercentage, 0)}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Efficiency score
            </div>
            <div
              className={cn(
                "text-2xl font-bold",
                EFFICIENCY_COLOR(result.efficiencyScore)
              )}
            >
              {result.efficiencyScore}/100
            </div>
            <div className="mt-0.5 text-xs text-zinc-400">
              {EFFICIENCY_LABEL(result.efficiencyScore)}
            </div>
          </div>
        </div>
      </section>

      {/* AI Summary */}
      {result.aiSummary && (
        <section
          className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
          aria-label="AI audit summary"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <Sparkles className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            AI Summary
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
            {result.aiSummary}
          </p>
        </section>
      )}

      {/* Share + Email */}
      <section
        className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Share your report"
      >
        <div>
          <p className="font-medium text-zinc-900 dark:text-white">Share this report</p>
          <p className="mt-0.5 text-sm text-zinc-400">
            Share a permanent link with your team or investors.
          </p>
          {showEmailInput && (
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email..."
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <Button
                size="sm"
                variant="accent"
                onClick={handleEmailReport}
                disabled={emailStatus === "sending"}
              >
                Send
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2"
          >
            {shareStatus === "copied" ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Copy link
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmailReport}
            disabled={emailStatus === "sending" || emailStatus === "sent"}
            className="gap-2"
          >
            {emailStatus === "sent" ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                Sent!
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {emailStatus === "sending" ? "Sending..." : "Email report"}
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Recommendations */}
      {actionableRecs.length > 0 && (
        <section aria-label="Audit recommendations">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Recommendations ({actionableRecs.length})
          </h2>
          <div className="space-y-3">
            {actionableRecs
              .sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings)
              .map((rec) => (
                <RecommendationCard key={rec.toolId} recommendation={rec} />
              ))}
          </div>
        </section>
      )}

      {/* Well-optimized tools */}
      {keepRecs.length > 0 && (
        <section aria-label="Well-optimized tools">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Already optimized
          </h2>
          <div className="space-y-3">
            {keepRecs.map((rec) => (
              <RecommendationCard key={rec.toolId} recommendation={rec} />
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
        Savings estimates are based on public pricing data. Always verify before making changes.{" "}
        <a
          href="https://github.com/jay-07-pixel/stack_save"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-700"
        >
          See methodology
        </a>
        .
      </p>
    </div>
  );
}
