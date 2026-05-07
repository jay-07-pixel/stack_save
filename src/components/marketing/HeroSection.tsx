import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ROUTES } from "@/constants/routes";
import { landingHero, landingStats } from "@/data/landing";

export function HeroSection() {
  return (
    <Section
      pad="lg"
      variant="bordered"
      aria-label="Hero"
      className="relative overflow-hidden"
    >
      <Container size="default" className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3 text-accent" aria-hidden />
            {landingHero.eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {landingHero.titleLine1}
            <br />
            <span className="text-accent">{landingHero.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {landingHero.description}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="accent" size="lg" className="gap-2 shadow-sm">
              <Link href={ROUTES.audit}>
                {landingHero.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={landingHero.secondaryHref}>{landingHero.secondaryCta}</Link>
            </Button>
          </div>
          <ul className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {landingStats.map((stat) => (
              <li key={stat.label} className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
