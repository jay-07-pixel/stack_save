import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {
  landingSocialProof,
  landingSavingsPreview,
} from "@/data/landing";

export function SavingsPreviewSection() {
  return (
    <Section pad="md" variant="muted" aria-labelledby="savings-preview-heading">
      <Container>
        <p
          id="savings-preview-heading"
          className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          {landingSocialProof.title}
        </p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {landingSavingsPreview.map((row) => (
            <li
              key={row.tool}
              className="rounded-xl border border-border bg-card p-5 shadow-xs"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {row.type}
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  Save {row.saving}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{row.tool}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {row.issue}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
