import type { ReactNode } from "react";
import { MarketingShell } from "@/components/layout/MarketingShell";

export default function SharedReportLayout({ children }: { children: ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
