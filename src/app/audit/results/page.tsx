import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuditResultsContent } from "@/components/audit/AuditResultsContent";

function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
        <p className="text-sm text-zinc-500">Loading your audit...</p>
      </div>
    </div>
  );
}

export default function AuditResultsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <Header />
      <Suspense fallback={<LoadingState />}>
        <AuditResultsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
