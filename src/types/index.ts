// ─── Tool Input Types ──────────────────────────────────────────────────────

export type PricingModel = "per_seat" | "flat" | "usage_based" | "tiered";
export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "customer_support"
  | "data_analysis"
  | "design"
  | "marketing"
  | "general";

export interface AuditToolEntry {
  id: string;
  name: string;
  plan: string;
  monthlySpend: number; // USD
  seats: number;
  useCase: UseCase;
  pricingModel: PricingModel;
}

// ─── Audit Form Schema ─────────────────────────────────────────────────────

export interface AuditFormData {
  companyName: string;
  teamSize: number;
  email: string;
  tools: AuditToolEntry[];
}

// ─── Audit Engine Output ───────────────────────────────────────────────────

export type RecommendationType =
  | "downgrade"
  | "consolidate"
  | "switch_to_api"
  | "eliminate"
  | "keep"
  | "negotiate";

export interface AuditRecommendation {
  toolId: string;
  toolName: string;
  type: RecommendationType;
  reason: string;
  currentMonthlyCost: number;
  estimatedMonthlySavings: number;
  confidence: "high" | "medium" | "low";
  actionItems: string[];
  alternativeTool?: string;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  formData: AuditFormData;
  recommendations: AuditRecommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalYearlySavings: number;
  savingsPercentage: number;
  efficiencyScore: number; // 0-100
  aiSummary?: string;
  shareSlug: string;
}

// ─── Firebase Document ─────────────────────────────────────────────────────

export interface AuditDocument extends AuditResult {
  ipHash?: string;
  userAgent?: string;
  viewCount?: number;
}

// ─── API Response Types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
