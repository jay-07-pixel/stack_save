import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, ExternalLink } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { GITHUB_REPO_URL } from "@/constants/links";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 w-full border-b border-border/80 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70",
        className
      )}
    >
      <Container className="flex h-full items-center justify-between gap-4">
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            StackSave
          </span>
        </Link>

        <nav
          className="flex items-center gap-2 sm:gap-3"
          aria-label="Primary"
        >
          <Button variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex" asChild>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" aria-hidden />
              GitHub
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden" asChild>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </Button>
          <Button variant="accent" size="sm" className="shadow-xs" asChild>
            <Link href={ROUTES.audit}>Run audit</Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
