import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StackSave — AI Spend Audit for Startups",
    template: "%s | StackSave",
  },
  description:
    "Get an instant audit of your AI tooling costs. StackSave analyzes your subscriptions, identifies overlap, and surfaces actionable savings — free, in under 2 minutes.",
  keywords: [
    "AI spend audit",
    "startup cost reduction",
    "SaaS optimization",
    "AI tooling",
    "cost savings",
    "ChatGPT",
    "GitHub Copilot",
  ],
  openGraph: {
    title: "StackSave — AI Spend Audit for Startups",
    description:
      "Instantly audit your AI tool spend and discover where you're leaving money on the table.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackSave — AI Spend Audit for Startups",
    description: "Free AI spend audit. Get instant recommendations in 2 minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
