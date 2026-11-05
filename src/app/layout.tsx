import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Providers from "@/components/providers/Providers";
import "./globals.css";

// Self-hosted display serif (no runtime call to Google Fonts)
const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sevoura.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SEVOURA — Seven Rituals. Infinite Expressions.",
    template: "%s · SEVOURA",
  },
  description:
    "The SEVOURA 7-Day Planetary Blend Collection — seven alcohol-free fragrance blends inspired by traditional planetary symbolism. Cleanse. Elevate. Radiate.",
  openGraph: {
    title: "SEVOURA — Seven Rituals. Infinite Expressions.",
    description: "Seven alcohol-free fragrance blends for a seven-day ritual.",
    images: ["/sevoura-bottle.jpeg"],
    type: "website",
    locale: "en_IN",
    siteName: "SEVOURA",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F0E6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
