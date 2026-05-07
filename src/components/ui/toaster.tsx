"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group rounded-lg border border-border bg-card text-card-foreground shadow-md",
        },
      }}
    />
  );
}
