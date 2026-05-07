import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditResultsDashboard } from "@/components/audit/AuditResultsDashboard";
import { getAuditBySlug } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { ROUTES } from "@/constants/routes";

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
    <Container size="default" className="max-w-4xl py-12 sm:py-16">
      <div className="mb-8 rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              You&apos;re viewing a shared audit report
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Run a free audit for your own team — takes about two minutes.
            </p>
          </div>
          <Button asChild variant="accent" size="sm" className="shrink-0 gap-2">
            <Link href={ROUTES.audit}>
              Run my own audit
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground [letter-spacing:var(--tracking-tight)]">
          Audit results
        </h1>
        <div className="text-sm text-muted-foreground">
          {audit.formData.companyName} ·{" "}
          {new Date(audit.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <AuditResultsDashboard result={audit} />
    </Container>
  );
}
