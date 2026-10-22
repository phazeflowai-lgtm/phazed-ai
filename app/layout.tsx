import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PHAZED AI | Electrical Estimation Automation",
  description:
    "PHAZED AI turns electrical blueprints into priced quotes. It detects every point, calculates cable, labour and materials, and prices it ex GST. Built on the Gold Coast, QLD.",
  openGraph: {
    title: "PHAZED AI | Blueprint to priced electrical quote",
    description:
      "AI agents read the AS/NZS 1102 legend, count every point, and return a quality-checked electrical estimate.",
    locale: "en_AU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06111d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
