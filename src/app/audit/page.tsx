"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
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
      const result: AuditResult = runAuditEngine(data);

      startTransition(async () => {
        try {
          await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
          });
        } catch {
          console.warn("Failed to persist audit to Firestore");
        }
      });

      sessionStorage.setItem("stacksave_current_audit", JSON.stringify(result));
      router.push(`/audit/results?id=${result.shareSlug}`);
    } catch (error) {
      console.error("Audit engine error:", error);
      setIsLoading(false);
    }
  }

  return (
    <Container size="default" className="max-w-4xl py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl [letter-spacing:var(--tracking-tight)]">
          Audit your AI spend
        </h1>
        <p className="mt-3 text-muted-foreground">
          Enter each AI tool your team uses. Your progress is saved automatically —
          come back any time.
        </p>
      </div>

      <AuditForm onSubmit={handleFormSubmit} isLoading={isLoading || isPending} />
    </Container>
  );
}
