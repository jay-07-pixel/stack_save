"use client";

import { AuditRecommendation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, TrendingDown, Zap, Merge, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: AuditRecommendation;
}

const TYPE_CONFIG = {
  downgrade: {
    label: "Downgrade",
    icon: TrendingDown,
    badgeVariant: "success" as const,
    borderColor: "border-l-emerald-500",
  },
  consolidate: {
    label: "Consolidate",
    icon: Merge,
    badgeVariant: "warning" as const,
    borderColor: "border-l-amber-500",
  },
  switch_to_api: {
    label: "Switch to API",
    icon: Zap,
    badgeVariant: "success" as const,
    borderColor: "border-l-blue-500",
  },
  eliminate: {
    label: "Eliminate",
    icon: TrendingDown,
    badgeVariant: "destructive" as const,
    borderColor: "border-l-red-500",
  },
  negotiate: {
    label: "Negotiate",
    icon: MessageSquare,
    badgeVariant: "secondary" as const,
    borderColor: "border-l-zinc-400",
  },
  keep: {
    label: "Optimized",
    icon: CheckCircle2,
    badgeVariant: "secondary" as const,
    borderColor: "border-l-zinc-300",
  },
};

const CONFIDENCE_LABEL = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
  const config = TYPE_CONFIG[rec.type];
  const Icon = config.icon;
  const isKeep = rec.type === "keep";

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white pl-0 dark:border-zinc-800 dark:bg-zinc-900",
        "overflow-hidden"
      )}
    >
      <div className={cn("flex gap-0")}>
        {/* Left accent bar */}
        <div className={cn("w-1 shrink-0", config.borderColor.replace("border-l-", "bg-"))} />

        <div className="flex-1 p-5">
          {/* Header */}
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon
                className={cn(
                  "h-4 w-4",
                  isKeep ? "text-zinc-400" : "text-zinc-600 dark:text-zinc-300"
                )}
                aria-hidden="true"
              />
              <span className="font-semibold text-zinc-900 dark:text-white">
                {rec.toolName}
              </span>
              <Badge variant={config.badgeVariant}>{config.label}</Badge>
            </div>

            {!isKeep && rec.estimatedMonthlySavings > 0 && (
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  Save {formatCurrency(rec.estimatedMonthlySavings)}/mo
                </div>
                <div className="text-xs text-zinc-400">
                  {formatCurrency(rec.estimatedMonthlySavings * 12)}/year
                </div>
              </div>
            )}
          </div>

          {/* Reason */}
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            {rec.reason}
          </p>

          {/* Action items */}
          {!isKeep && rec.actionItems.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Action steps
              </p>
              <ul className="space-y-1.5">
                {rec.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence + Alt tool */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs text-zinc-400">
              {CONFIDENCE_LABEL[rec.confidence]}
            </span>
            {rec.alternativeTool && (
              <span className="text-xs text-zinc-400">
                · Alternative: <span className="font-medium text-zinc-600 dark:text-zinc-300">{rec.alternativeTool}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
