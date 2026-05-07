import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  pad?: "sm" | "md" | "lg";
  variant?: "default" | "muted" | "bordered";
};

const padClass = {
  sm: "py-14 sm:py-16",
  md: "py-16 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
} as const;

const variantClass = {
  default: "",
  muted: "bg-muted/50",
  bordered: "border-y border-border",
} as const;

export function Section({
  className,
  pad = "md",
  variant = "default",
  id,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(padClass[pad], variantClass[variant], className)}
      {...props}
    />
  );
}
