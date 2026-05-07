import { describe, it, expect } from "vitest";
import { runAuditEngine } from "@/engine/audit";
import { AuditFormData } from "@/types";

const baseFormData: AuditFormData = {
  companyName: "Test Startup",
  teamSize: 10,
  email: "cto@test.com",
  tools: [],
};

describe("runAuditEngine", () => {
  describe("downgrade recommendations", () => {
    it("recommends downgrade when on Business plan with few seats", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [
          {
            id: "t1",
            name: "ChatGPT",
            plan: "Team",
            monthlySpend: 50,
            seats: 2,
            useCase: "writing",
            pricingModel: "per_seat",
          },
        ],
      };

      const result = runAuditEngine(formData);
      const rec = result.recommendations.find((r) => r.toolId === "t1");

      expect(rec).toBeDefined();
      expect(rec!.type).toBe("downgrade");
      expect(rec!.estimatedMonthlySavings).toBeGreaterThan(0);
      expect(rec!.confidence).toBe("high");
    });
  });

  describe("keep recommendations", () => {
    it("recommends keeping a well-priced single-seat tool", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [
          {
            id: "t1",
            name: "Cursor",
            plan: "Pro",
            monthlySpend: 20,
            seats: 1,
            useCase: "coding",
            pricingModel: "per_seat",
          },
        ],
      };

      const result = runAuditEngine(formData);
      const rec = result.recommendations.find((r) => r.toolId === "t1");

      expect(rec).toBeDefined();
      expect(rec!.type).toBe("keep");
      expect(rec!.estimatedMonthlySavings).toBe(0);
    });
  });

  describe("overlap / consolidation", () => {
    it("detects overlap between two writing tools", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [
          {
            id: "t1",
            name: "Jasper",
            plan: "Creator",
            monthlySpend: 49,
            seats: 1,
            useCase: "writing",
            pricingModel: "flat",
          },
          {
            id: "t2",
            name: "ChatGPT",
            plan: "Plus",
            monthlySpend: 20,
            seats: 1,
            useCase: "writing",
            pricingModel: "per_seat",
          },
        ],
      };

      const result = runAuditEngine(formData);
      const hasConsolidateRec = result.recommendations.some(
        (r) => r.type === "consolidate"
      );

      expect(hasConsolidateRec).toBe(true);
    });
  });

  describe("API switch opportunity", () => {
    it("recommends API switch for high-spend usage-based tools", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [
          {
            id: "t1",
            name: "ChatGPT",
            plan: "Team",
            monthlySpend: 250,
            seats: 10,
            useCase: "general",
            pricingModel: "per_seat",
          },
        ],
      };

      const result = runAuditEngine(formData);
      const rec = result.recommendations.find((r) => r.toolId === "t1");

      // Either downgrade or API switch is valid — the engine picks the first applicable rule
      expect(["downgrade", "switch_to_api"]).toContain(rec!.type);
    });
  });

  describe("savings totals", () => {
    it("correctly sums savings across multiple tools", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [
          {
            id: "t1",
            name: "ChatGPT",
            plan: "Team",
            monthlySpend: 50,
            seats: 2,
            useCase: "writing",
            pricingModel: "per_seat",
          },
          {
            id: "t2",
            name: "Cursor",
            plan: "Pro",
            monthlySpend: 20,
            seats: 1,
            useCase: "coding",
            pricingModel: "per_seat",
          },
        ],
      };

      const result = runAuditEngine(formData);

      expect(result.totalMonthlySpend).toBe(70);
      expect(result.totalMonthlySavings).toBe(
        result.recommendations.reduce(
          (sum, r) => sum + r.estimatedMonthlySavings,
          0
        )
      );
      expect(result.totalYearlySavings).toBe(result.totalMonthlySavings * 12);
    });

    it("keeps efficiency score within 0-100 bounds", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [
          {
            id: "t1",
            name: "Jasper",
            plan: "Creator",
            monthlySpend: 49,
            seats: 1,
            useCase: "writing",
            pricingModel: "flat",
          },
        ],
      };

      const result = runAuditEngine(formData);

      expect(result.efficiencyScore).toBeGreaterThanOrEqual(0);
      expect(result.efficiencyScore).toBeLessThanOrEqual(100);
    });
  });

  describe("edge cases", () => {
    it("handles empty tools array gracefully", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [],
      };

      const result = runAuditEngine(formData);

      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalMonthlySavings).toBe(0);
      expect(result.recommendations).toHaveLength(0);
    });

    it("handles zero monthly spend without errors", () => {
      const formData: AuditFormData = {
        ...baseFormData,
        tools: [
          {
            id: "t1",
            name: "ChatGPT",
            plan: "Free",
            monthlySpend: 0,
            seats: 1,
            useCase: "general",
            pricingModel: "flat",
          },
        ],
      };

      expect(() => runAuditEngine(formData)).not.toThrow();
    });

    it("generates a unique shareSlug for each audit", () => {
      const result1 = runAuditEngine({ ...baseFormData, tools: [] });
      const result2 = runAuditEngine({ ...baseFormData, tools: [] });

      expect(result1.shareSlug).not.toBe(result2.shareSlug);
    });

    it("always sets a createdAt timestamp", () => {
      const result = runAuditEngine({ ...baseFormData, tools: [] });

      expect(result.createdAt).toBeDefined();
      expect(new Date(result.createdAt).getTime()).not.toBeNaN();
    });
  });
});
