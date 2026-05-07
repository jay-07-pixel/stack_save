import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ROUTES } from "@/constants/routes";
import { landingCta } from "@/data/landing";

export function CtaFooterSection() {
  return (
    <Section
      pad="md"
      className="border-t border-border bg-zinc-950 text-zinc-50 dark:bg-black"
      aria-labelledby="cta-heading"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="cta-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl text-white"
          >
            {landingCta.title}
          </h2>
          <p className="mt-4 text-zinc-400">{landingCta.subtitle}</p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 border-0 bg-emerald-500 text-white hover:bg-emerald-600 shadow-md"
            >
              <Link href={ROUTES.audit}>
                {landingCta.buttonLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <ul className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            {landingCta.highlights.map((line) => (
              <li key={line} className="flex items-center gap-2 text-sm text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
