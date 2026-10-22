import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PHAZED AI | AI Workforces & Execution Systems",
  description:
    "PHAZED AI builds AI agents, workforces, and execution systems that take businesses from idea to shipped product, faster.",
  openGraph: {
    title: "PHAZED AI | AI agents designed to ship",
    description:
      "Specialized AI agents that research, build, review, test, and deploy as one coordinated workforce.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06111d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
