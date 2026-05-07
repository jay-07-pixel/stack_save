"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuditForm } from "@/components/audit/AuditForm";
import { AuditFormData, AuditResult } from "@/types";
import { runAuditEngine } from "@/engine/audit";

export default function AuditPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  async function handleFormSubmit(data: AuditFormData) {
    setIsLoading(true);

    try {
      // Run the deterministic engine client-side (instant results)
      const result: AuditResult = runAuditEngine(data);

      // Persist to Firestore and get AI summary in parallel (non-blocking)
      startTransition(async () => {
        try {
          await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
          });
        } catch {
          // Non-critical — results are still shown even if persistence fails
          console.warn("Failed to persist audit to Firestore");
        }
      });

      // Store result in sessionStorage so the results page can read it
      sessionStorage.setItem("stacksave_current_audit", JSON.stringify(result));

      // Navigate to results
      router.push(`/audit/results?id=${result.shareSlug}`);
    } catch (error) {
      console.error("Audit engine error:", error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Audit your AI spend
            </h1>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              Enter each AI tool your team uses. Your progress is saved
              automatically — come back any time.
            </p>
          </div>

          <AuditForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading || isPending}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
