import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuditResultsDashboard } from "@/components/audit/AuditResultsDashboard";
import { getAuditBySlug } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const audit = await getAuditBySlug(slug).catch(() => null);

  if (!audit) {
    return { title: "Audit not found | StackSave" };
  }

  const savings = formatCurrency(audit.totalMonthlySavings);

  return {
    title: `${audit.formData.companyName}'s AI spend audit — ${savings}/mo in savings | StackSave`,
    description: `View ${audit.formData.companyName}'s AI tooling audit. StackSave identified ${savings}/month in potential savings across ${audit.formData.tools.length} tools.`,
    openGraph: {
      title: `${audit.formData.companyName} — AI Spend Audit`,
      description: `${savings}/month in savings identified across ${audit.formData.tools.length} AI tools.`,
    },
  };
}

export default async function SharedReportPage({ params }: PageProps) {
  const { slug } = await params;

  let audit;
  try {
    audit = await getAuditBySlug(slug);
  } catch {
    notFound();
  }

  if (!audit) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Shared report banner */}
          <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  You&apos;re viewing a shared audit report
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Run a free audit for your own team — takes 2 minutes.
                </p>
              </div>
              <Button asChild variant="accent" size="sm" className="gap-2 shrink-0">
                <Link href="/audit">
                  Run my own audit
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Report header */}
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Audit results
            </h1>
            <div className="text-sm text-zinc-400">
              {audit.formData.companyName} ·{" "}
              {new Date(audit.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          <AuditResultsDashboard result={audit} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
