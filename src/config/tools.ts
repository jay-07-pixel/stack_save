import { UseCase } from "@/types";

// ─── Known AI Tool Catalog ─────────────────────────────────────────────────
// Pricing verified against public pricing pages as of Q1 2025.
// See PRICING_DATA.md for sources.

export interface KnownTool {
  name: string;
  category: "coding" | "writing" | "multimodal" | "analytics" | "support";
  plans: {
    name: string;
    monthlyPerSeat: number;
    flatMonthly?: number;
    apiAccessAvailable: boolean;
    maxSeats?: number;
  }[];
  hasApiAccess: boolean;
  apiCostPer1MTokens?: number; // USD, approximate blended
  useCases: UseCase[];
  alternatives?: string[];
}

export const KNOWN_TOOLS: KnownTool[] = [
  {
    name: "GitHub Copilot",
    category: "coding",
    plans: [
      {
        name: "Individual",
        monthlyPerSeat: 10,
        apiAccessAvailable: false,
      },
      {
        name: "Business",
        monthlyPerSeat: 19,
        apiAccessAvailable: false,
      },
      {
        name: "Enterprise",
        monthlyPerSeat: 39,
        apiAccessAvailable: false,
      },
    ],
    hasApiAccess: false,
    useCases: ["coding"],
    alternatives: ["Cursor", "Codeium", "Amazon CodeWhisperer"],
  },
  {
    name: "Cursor",
    category: "coding",
    plans: [
      { name: "Hobby", monthlyPerSeat: 0, apiAccessAvailable: false },
      { name: "Pro", monthlyPerSeat: 20, apiAccessAvailable: false },
      {
        name: "Business",
        monthlyPerSeat: 40,
        apiAccessAvailable: false,
      },
    ],
    hasApiAccess: false,
    useCases: ["coding"],
    alternatives: ["GitHub Copilot", "Codeium"],
  },
  {
    name: "ChatGPT",
    category: "multimodal",
    plans: [
      { name: "Free", monthlyPerSeat: 0, apiAccessAvailable: true },
      { name: "Plus", monthlyPerSeat: 20, apiAccessAvailable: true },
      {
        name: "Team",
        monthlyPerSeat: 25,
        apiAccessAvailable: true,
        maxSeats: 150,
      },
      { name: "Enterprise", monthlyPerSeat: 60, apiAccessAvailable: true },
    ],
    hasApiAccess: true,
    apiCostPer1MTokens: 5, // GPT-4o blended
    useCases: ["writing", "research", "coding", "general", "data_analysis"],
    alternatives: ["Claude", "Gemini"],
  },
  {
    name: "Claude",
    category: "multimodal",
    plans: [
      { name: "Free", monthlyPerSeat: 0, apiAccessAvailable: true },
      { name: "Pro", monthlyPerSeat: 20, apiAccessAvailable: true },
      { name: "Team", monthlyPerSeat: 25, apiAccessAvailable: true },
      {
        name: "Enterprise",
        monthlyPerSeat: 0,
        apiAccessAvailable: true,
      },
    ],
    hasApiAccess: true,
    apiCostPer1MTokens: 3, // Claude 3.5 Sonnet
    useCases: ["writing", "research", "coding", "general", "customer_support"],
    alternatives: ["ChatGPT", "Gemini"],
  },
  {
    name: "Gemini",
    category: "multimodal",
    plans: [
      { name: "Free", monthlyPerSeat: 0, apiAccessAvailable: true },
      {
        name: "Advanced",
        monthlyPerSeat: 19.99,
        apiAccessAvailable: true,
      },
      {
        name: "Business",
        monthlyPerSeat: 20,
        apiAccessAvailable: true,
      },
    ],
    hasApiAccess: true,
    apiCostPer1MTokens: 1.25, // Gemini 1.5 Flash blended
    useCases: ["writing", "research", "general", "data_analysis"],
    alternatives: ["ChatGPT", "Claude"],
  },
  {
    name: "Notion AI",
    category: "writing",
    plans: [
      { name: "Add-on", monthlyPerSeat: 10, apiAccessAvailable: false },
      {
        name: "Business Bundle",
        monthlyPerSeat: 20,
        apiAccessAvailable: false,
      },
    ],
    hasApiAccess: false,
    useCases: ["writing", "research"],
    alternatives: ["Claude", "ChatGPT"],
  },
  {
    name: "Jasper",
    category: "writing",
    plans: [
      { name: "Creator", monthlyPerSeat: 49, apiAccessAvailable: false },
      { name: "Pro", monthlyPerSeat: 69, apiAccessAvailable: false },
      {
        name: "Business",
        monthlyPerSeat: 0,
        apiAccessAvailable: false,
      },
    ],
    hasApiAccess: false,
    useCases: ["writing", "marketing"],
    alternatives: ["Claude", "ChatGPT Plus"],
  },
  {
    name: "Grammarly",
    category: "writing",
    plans: [
      { name: "Free", monthlyPerSeat: 0, apiAccessAvailable: false },
      { name: "Premium", monthlyPerSeat: 12, apiAccessAvailable: false },
      { name: "Business", monthlyPerSeat: 15, apiAccessAvailable: false },
    ],
    hasApiAccess: false,
    useCases: ["writing"],
    alternatives: ["Claude", "ChatGPT Plus"],
  },
  {
    name: "Perplexity",
    category: "analytics",
    plans: [
      { name: "Free", monthlyPerSeat: 0, apiAccessAvailable: true },
      { name: "Pro", monthlyPerSeat: 20, apiAccessAvailable: true },
    ],
    hasApiAccess: true,
    useCases: ["research"],
    alternatives: ["ChatGPT Plus", "Claude Pro"],
  },
  {
    name: "Intercom Fin",
    category: "support",
    plans: [
      {
        name: "Starter",
        monthlyPerSeat: 29,
        apiAccessAvailable: false,
      },
      {
        name: "Pro",
        monthlyPerSeat: 85,
        apiAccessAvailable: false,
      },
    ],
    hasApiAccess: false,
    useCases: ["customer_support"],
    alternatives: ["Custom GPT-4 integration"],
  },
];

export const TOOL_NAMES = KNOWN_TOOLS.map((t) => t.name);

export function findKnownTool(name: string): KnownTool | undefined {
  return KNOWN_TOOLS.find(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );
}
