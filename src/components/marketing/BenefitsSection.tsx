import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { landingBenefits } from "@/data/landing";

export function BenefitsSection() {
  return (
    <Section
      id="benefits"
      pad="md"
      variant="muted"
      aria-labelledby="benefits-heading"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="benefits-heading"
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Why teams run StackSave before renewals
          </h2>
          <p className="mt-4 text-muted-foreground">
            A crisp audit beats another spreadsheet no one maintains. These are
            the outcomes we optimize for.
          </p>
        </div>
        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {landingBenefits.map((item) => (
            <li key={item.title} className="flex gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card shadow-xs">
                <item.icon
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
