import { MarketingShell } from "@/components/layout/MarketingShell";
import {
  HeroSection,
  BenefitsSection,
  HowItWorksSection,
  SavingsPreviewSection,
  FaqSection,
  CtaFooterSection,
} from "@/components/marketing";

export default function HomePage() {
  return (
    <MarketingShell>
      <HeroSection />
      <SavingsPreviewSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FaqSection />
      <CtaFooterSection />
    </MarketingShell>
  );
}
