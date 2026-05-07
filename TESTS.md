# TESTS.md — Testing Strategy

## Philosophy

We test what can fail silently and costs money to get wrong. The audit engine's financial calculations are the highest-risk surface — wrong numbers mean wrong advice. We test those exhaustively.

UI components are tested for behavior (does the form validate?), not for snapshot accuracy.

---

## Test Layers

### 1. Unit Tests — Audit Engine (`src/engine/audit.ts`)

The engine is a pure function: `runAuditEngine(formData) → AuditResult`.  
No side effects, no network calls. Easy to test exhaustively.

**Coverage targets:**
- All 4 recommendation rules (downgrade, API switch, overlap, high-cost-per-seat)
- Edge cases: zero spend, single seat, unknown tool, max seats
- Savings calculation accuracy
- Efficiency score bounds (0-100)

### 2. Unit Tests — Utilities (`src/lib/utils.ts`)

- `formatCurrency`: USD formatting
- `formatPercent`: percentage formatting
- `generateSlug`: length and charset validation
- `slugify`: special character handling

### 3. Integration Tests — API Routes

- `/api/audit`: validates Zod schema rejection, successful save path
- `/api/ai-summary`: tests fallback when OPENAI_API_KEY is missing
- `/api/email`: tests Resend call structure

### 4. Component Tests (future)

- Audit form: validates required field errors
- Results page: renders correct savings totals
- Share URL: renders correctly from mocked Firestore data

---

## Running Tests

```bash
# Run all tests
npm run test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Test Configuration

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

---

## Test Cases — Audit Engine

### Downgrade detection
```
Input:  ChatGPT Team plan, 2 seats, $50/month
Expect: recommendation.type === "downgrade"
Expect: estimatedMonthlySavings > 0
Expect: confidence === "high"
```

### API switch opportunity
```
Input:  ChatGPT Plus, 5 seats, $100/month
Expect: recommendation.type === "switch_to_api"
Expect: estimatedMonthlySavings > 0
```

### Overlap detection
```
Input:  tools = [ChatGPT Plus ($20, writing), Jasper Creator ($49, writing)]
Expect: at least one "consolidate" recommendation
Expect: alternativeTool is set
```

### High-cost-per-seat
```
Input:  CustomTool, $200/month, 2 seats ($100/seat)
Expect: recommendation.type === "negotiate"
Expect: confidence === "low"
```

### Well-optimized stack
```
Input:  Cursor Pro, 1 seat, $20/month
Expect: recommendation.type === "keep"
Expect: estimatedMonthlySavings === 0
```

### Zero spend
```
Input:  tool with monthlySpend = 0
Expect: no savings recommendations
Expect: no errors thrown
```

### Total savings calculation
```
Input:  tools totaling $500/month
        recommendations totaling $150/month in savings
Expect: totalMonthlySavings === 150
Expect: totalYearlySavings === 1800
Expect: savingsPercentage === 30
```
