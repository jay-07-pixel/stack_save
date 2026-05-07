"use client";

import { UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AuditFormSchema } from "@/lib/schemas";
import { TOOL_NAMES } from "@/config/tools";
import { UseCase, PricingModel } from "@/types";

interface ToolRowProps {
  index: number;
  form: UseFormReturn<AuditFormSchema>;
  onRemove: () => void;
  canRemove: boolean;
}

const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding / Dev" },
  { value: "writing", label: "Writing / Content" },
  { value: "research", label: "Research" },
  { value: "customer_support", label: "Customer Support" },
  { value: "data_analysis", label: "Data Analysis" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "general", label: "General / Chat" },
];

const PRICING_MODEL_OPTIONS: { value: PricingModel; label: string }[] = [
  { value: "per_seat", label: "Per seat" },
  { value: "flat", label: "Flat monthly" },
  { value: "usage_based", label: "Usage-based" },
  { value: "tiered", label: "Tiered" },
];

export function ToolRow({ index, form, onRemove, canRemove }: ToolRowProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const toolErrors = errors.tools?.[index];
  const watchedUseCase = watch(`tools.${index}.useCase`);
  const watchedPricingModel = watch(`tools.${index}.pricingModel`);

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Tool #{index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label={`Remove tool ${index + 1}`}
            className="h-7 w-7 text-zinc-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tool Name */}
        <div className="space-y-1.5">
          <Label htmlFor={`tools.${index}.name`}>Tool name</Label>
          <Input
            id={`tools.${index}.name`}
            placeholder="e.g. ChatGPT, Cursor"
            list={`tool-suggestions-${index}`}
            error={toolErrors?.name?.message}
            {...register(`tools.${index}.name`)}
          />
          <datalist id={`tool-suggestions-${index}`}>
            {TOOL_NAMES.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        {/* Plan */}
        <div className="space-y-1.5">
          <Label htmlFor={`tools.${index}.plan`}>Plan</Label>
          <Input
            id={`tools.${index}.plan`}
            placeholder="e.g. Team, Pro, Enterprise"
            error={toolErrors?.plan?.message}
            {...register(`tools.${index}.plan`)}
          />
        </div>

        {/* Monthly Spend */}
        <div className="space-y-1.5">
          <Label htmlFor={`tools.${index}.monthlySpend`}>
            Monthly spend (USD)
          </Label>
          <Input
            id={`tools.${index}.monthlySpend`}
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 50"
            error={toolErrors?.monthlySpend?.message}
            {...register(`tools.${index}.monthlySpend`, {
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <Label htmlFor={`tools.${index}.seats`}>Active seats</Label>
          <Input
            id={`tools.${index}.seats`}
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 5"
            error={toolErrors?.seats?.message}
            {...register(`tools.${index}.seats`, { valueAsNumber: true })}
          />
        </div>

        {/* Use Case */}
        <div className="space-y-1.5">
          <Label>Primary use case</Label>
          <Select
            value={watchedUseCase}
            onValueChange={(val) =>
              setValue(`tools.${index}.useCase`, val as UseCase, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger error={toolErrors?.useCase?.message}>
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>
            <SelectContent>
              {USE_CASE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing Model */}
        <div className="space-y-1.5">
          <Label>Pricing model</Label>
          <Select
            value={watchedPricingModel}
            onValueChange={(val) =>
              setValue(`tools.${index}.pricingModel`, val as PricingModel, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger error={toolErrors?.pricingModel?.message}>
              <SelectValue placeholder="Select pricing model" />
            </SelectTrigger>
            <SelectContent>
              {PRICING_MODEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
