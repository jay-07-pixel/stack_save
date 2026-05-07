import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  DollarSign,
  FileText,
  Lock,
  Share2,
  TrendingDown,
} from "lucide-react";

export const landingHero = {
  eyebrow: "Free AI spend audit — results in about two minutes",
  titleLine1: "Your team is probably",
  titleHighlight: "overpaying for AI.",
  description:
    "StackSave reviews your AI subscriptions—plans, seats, and monthly spend—and surfaces realistic downgrade, overlap, and consolidation paths with dollar ranges you can take to finance.",
  primaryCta: "Run your free audit",
  secondaryCta: "See how it works",
  secondaryHref: "#how-it-works",
} as const;

export const landingStats = [
  { value: "$12.4k", label: "avg. annual savings surfaced in pilots" },
  { value: "~2 min", label: "median time to complete an audit" },
  { value: "$0", label: "cost while we validate pricing rules" },
] as const;

export const landingBenefits: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: TrendingDown,
    title: "Downgrade signals",
    description:
      "Flags expensive team or business tiers when your headcount and usage pattern look closer to individual plans.",
  },
  {
    icon: BarChart3,
    title: "Overlap map",
    description:
      "Surfaces tools solving the same job—so you can keep the one teams actually live in and retire the rest.",
  },
  {
    icon: DollarSign,
    title: "Usage vs. list price",
    description:
      "Compares what you pay today to typical public list pricing and calls out negotiation or annual-prepay levers.",
  },
  {
    icon: FileText,
    title: "Readable output",
    description:
      "Every finding includes a short rationale and next steps your CFO can skim without sitting through a slide deck.",
  },
  {
    icon: Share2,
    title: "Shareable report link",
    description:
      "Generate a stable URL you can drop in Slack, Notion, or a board pack—no PDF wrangling required.",
  },
  {
    icon: Lock,
    title: "No login for v1",
    description:
      "We bias to speed: you shouldn’t need SSO to learn whether your stack is reasonable.",
  },
];

export const landingHowItWorks = [
  {
    step: "01",
    title: "Inventory your stack",
    description:
      "Add each vendor, plan name, monthly invoice total, seats, and primary use case.",
  },
  {
    step: "02",
    title: "Apply transparent rules",
    description:
      "Our engine evaluates overlap, tier fit, and rough API-vs-seat economics—no black-box scoring.",
  },
  {
    step: "03",
    title: "Review savings bands",
    description:
      "See monthly and annual ranges plus ordered recommendations with concrete next actions.",
  },
  {
    step: "04",
    title: "Share or email",
    description:
      "Capture the report via email (optional) and keep a public link for stakeholders.",
  },
] as const;

export const landingSavingsPreview = [
  {
    tool: "ChatGPT Team",
    issue: "Team tier with two active seats",
    saving: "~$70/mo",
    type: "Tier fit",
  },
  {
    tool: "Jasper + ChatGPT",
    issue: "Duplicate writing workflows",
    saving: "~$49/mo",
    type: "Consolidate",
  },
  {
    tool: "GitHub Copilot Enterprise",
    issue: "Enterprise features unused by most seats",
    saving: "~$20/seat/mo",
    type: "Right-size",
  },
] as const;

export const landingFaq = [
  {
    q: "Is this financial advice?",
    a: "No. StackSave is a structured checklist and estimate based on public pricing and heuristics. Always confirm numbers in your contracts and invoices before changing vendors.",
  },
  {
    q: "Do you train models on my data?",
    a: "We store audit payloads you choose to save for sharing. Optional narrative summaries call a hosted model; you can skip that step if you prefer numbers-only output.",
  },
  {
    q: "What if our stack isn’t in your catalog?",
    a: "Add a custom row with your best estimate. The rules still run on seats, overlap, and spend concentration—even without a logo.",
  },
  {
    q: "Why not connect billing automatically?",
    a: "For the MVP we optimize for time-to-value and privacy. Future phases can add read-only billing integrations once trust and security reviews are in place.",
  },
] as const;

export const landingCta = {
  title: "Get a grounded read on your AI burn.",
  subtitle:
    "No credit card. No mandatory signup. Exportable narrative and share link when you need buy-in.",
  buttonLabel: "Start free audit",
  highlights: [
    "Works on mobile and desktop",
    "Draft autosaves locally while you type",
    "Built for seed–Series B team sizes",
  ],
} as const;

export const landingSocialProof = {
  title: "Common findings from early audits",
} as const;
