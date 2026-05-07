import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { landingHowItWorks } from "@/data/landing";

export function HowItWorksSection() {
  return (
    <Section
      id="how-it-works"
      pad="md"
      variant="bordered"
      aria-labelledby="how-heading"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="how-heading"
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Transparent inputs, explainable rules, and outputs you can defend in
            a budget review.
          </p>
        </div>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {landingHowItWorks.map((step) => (
            <li key={step.step} className="text-left">
              <span className="block text-4xl font-semibold text-muted-foreground/25">
                {step.step}
              </span>
              <h3 className="mt-3 font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
