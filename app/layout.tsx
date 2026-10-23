import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const OG_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3L5IGIjYZIPTSRoBWTWENtj7DaZ/hf_20261023_070544_966f8e4b-805e-4006-97d6-2a1107c95f23.png";

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
    images: [{ url: OG_IMAGE, alt: "A glowing electrical floor plan" }],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE] },
};

export const viewport: Viewport = {
  themeColor: "#050b14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
