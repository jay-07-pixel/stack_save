export const ROUTES = {
  home: "/",
  audit: "/audit",
  auditResults: "/audit/results",
  sharedReport: (slug: string) => `/r/${slug}` as const,
} as const;
