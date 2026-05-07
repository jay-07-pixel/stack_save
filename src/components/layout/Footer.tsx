import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 dark:bg-white">
              <BarChart3 className="h-4 w-4 text-white dark:text-zinc-900" aria-hidden="true" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">StackSave</span>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            AI spend audits for lean startups. Free, instant, no account required.
          </p>

          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/audit" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Run Audit
            </Link>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/jay-07-pixel/stack_save"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} StackSave. Pricing data is approximate and for reference only.
            Always verify with official vendor pricing pages.
          </p>
        </div>
      </div>
    </footer>
  );
}
