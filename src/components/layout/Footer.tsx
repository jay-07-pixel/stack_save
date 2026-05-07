import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { GITHUB_REPO_URL } from "@/constants/links";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="max-w-6xl py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BarChart3 className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold">StackSave</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Instant AI spend audits for lean teams. Transparent rules, realistic
            savings ranges, and a shareable report you can send to finance.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link
              href={ROUTES.audit}
              className="hover:text-foreground transition-colors"
            >
              Run audit
            </Link>
            <span aria-hidden className="text-border">
              ·
            </span>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} StackSave. Estimates use public
          pricing; verify with vendors before renewing.
        </p>
      </Container>
    </footer>
  );
}
