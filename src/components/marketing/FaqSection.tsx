"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { landingFaq } from "@/data/landing";

export function FaqSection() {
  return (
    <Section id="faq" pad="md" variant="bordered" aria-labelledby="faq-heading">
      <Container size="narrow">
        <h2
          id="faq-heading"
          className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Straight answers on scope, data handling, and what StackSave is not
          trying to be.
        </p>
        <Accordion type="single" collapsible className="mt-10 w-full">
          {landingFaq.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}
