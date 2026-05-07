import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Reserved for Phase 2+ (saved audits, trends, team dashboard).
 * Keeps the `components/dashboard` namespace explicit in the tree.
 */
export function DashboardPlaceholder() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Dashboard</CardTitle>
        <CardDescription>
          Portfolio and trend views will land here after the audit flow stabilizes.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        No routes mount this component yet — it documents intent for reviewers and future PRs.
      </CardContent>
    </Card>
  );
}
