"use client";

import { useCallback, useEffect, startTransition } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolRow } from "./ToolRow";
import { auditFormSchema, AuditFormSchema } from "@/lib/schemas";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AuditFormData } from "@/types";
import { generateSlug } from "@/lib/utils";

interface AuditFormProps {
  onSubmit: (data: AuditFormData) => void;
  isLoading?: boolean;
}

const DEFAULT_FORM_VALUES: AuditFormSchema = {
  companyName: "",
  teamSize: 1,
  email: "",
  tools: [
    {
      id: generateSlug(8),
      name: "",
      plan: "",
      monthlySpend: 0,
      seats: 1,
      useCase: "general",
      pricingModel: "per_seat",
    },
  ],
};

export function AuditForm({ onSubmit, isLoading = false }: AuditFormProps) {
  const [savedFormData, setSavedFormData, clearSavedFormData] =
    useLocalStorage<AuditFormSchema>("stacksave_audit_draft", DEFAULT_FORM_VALUES);

  const form = useForm<AuditFormSchema>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // Restore from localStorage after hydration
  useEffect(() => {
    if (savedFormData && savedFormData.tools?.length > 0) {
      const hasContent =
        savedFormData.companyName ||
        savedFormData.tools.some((t) => t.name);
      if (hasContent) {
        form.reset(savedFormData);
      }
    }
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchedValues = useWatch({
    control: form.control,
    defaultValue: DEFAULT_FORM_VALUES,
  }) as AuditFormSchema;

  useEffect(() => {
    startTransition(() => {
      setSavedFormData(watchedValues);
    });
  }, [watchedValues, setSavedFormData]);

  const handleAddTool = useCallback(() => {
    append({
      id: generateSlug(8),
      name: "",
      plan: "",
      monthlySpend: 0,
      seats: 1,
      useCase: "general",
      pricingModel: "per_seat",
    });
  }, [append]);

  const handleReset = useCallback(() => {
    clearSavedFormData();
    form.reset(DEFAULT_FORM_VALUES);
  }, [clearSavedFormData, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data as AuditFormData);
  });

  const totalMonthlySpend = watchedValues.tools?.reduce(
    (sum, t) => sum + (Number(t.monthlySpend) || 0),
    0
  ) ?? 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Company Info */}
      <section aria-labelledby="company-section-heading">
        <h2
          id="company-section-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
        >
          About your team
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              placeholder="Acme Inc."
              error={form.formState.errors.companyName?.message}
              {...form.register("companyName")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teamSize">Team size</Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              placeholder="e.g. 12"
              error={form.formState.errors.teamSize?.message}
              {...form.register("teamSize", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Your email</Label>
            <Input
              id="email"
              type="email"
              placeholder="cto@company.com"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />
            <p className="text-xs text-zinc-400">
              Used only to send your report. Never shared.
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section aria-labelledby="tools-section-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="tools-section-heading"
            className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
          >
            AI tools
          </h2>
          {totalMonthlySpend > 0 && (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Total:{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">
                ${totalMonthlySpend.toLocaleString()}/mo
              </span>
            </div>
          )}
        </div>

        {form.formState.errors.tools?.root?.message && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {form.formState.errors.tools.root.message}
          </p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <ToolRow
              key={field.id}
              index={index}
              form={form}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </div>

        {fields.length < 20 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTool}
            className="mt-4 gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add another tool
          </Button>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="gap-2 text-zinc-400 hover:text-zinc-700"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset form
        </Button>

        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Analyzing your stack...
            </>
          ) : (
            <>
              Run audit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
