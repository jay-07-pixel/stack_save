import { Suspense } from "react";
import { AuditResultsContent } from "@/components/audit/AuditResultsContent";

function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        <p className="text-sm text-muted-foreground">Loading your audit...</p>
      </div>
    </div>
  );
}

export default function AuditResultsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuditResultsContent />
    </Suspense>
  );
}
