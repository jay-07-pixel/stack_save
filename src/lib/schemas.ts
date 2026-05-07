import { z } from "zod";

export const toolEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tool name is required"),
  plan: z.string().min(1, "Plan is required"),
  monthlySpend: z
    .number({ error: "Enter a valid number" })
    .min(0, "Spend cannot be negative")
    .max(100000, "That seems too high — double-check your number"),
  seats: z
    .number({ error: "Enter a valid number" })
    .int("Seats must be a whole number")
    .min(1, "At least 1 seat required")
    .max(10000, "Enter a realistic seat count"),
  useCase: z.enum([
    "coding",
    "writing",
    "research",
    "customer_support",
    "data_analysis",
    "design",
    "marketing",
    "general",
  ]),
  pricingModel: z.enum(["per_seat", "flat", "usage_based", "tiered"]),
});

export const auditFormSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Keep it under 100 characters"),
  teamSize: z
    .number({ error: "Enter a valid number" })
    .int()
    .min(1, "Team size must be at least 1")
    .max(100000, "Enter a realistic team size"),
  email: z
    .string()
    .email("Enter a valid email address")
    .min(1, "Email is required"),
  tools: z
    .array(toolEntrySchema)
    .min(1, "Add at least one AI tool to audit")
    .max(20, "Maximum 20 tools per audit"),
});

export type AuditFormSchema = z.infer<typeof auditFormSchema>;
export type ToolEntrySchema = z.infer<typeof toolEntrySchema>;
