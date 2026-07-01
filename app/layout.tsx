import type { Metadata } from "next";
// Self-hosted fonts (no network fetch at compile time — works offline / behind
// restrictive networks). Swap these packages to change typefaces.
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Toaster } from "@/components/ui/sonner";
import { baseMetadata, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = baseMetadata();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd() }}
        />
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3 focus:shadow"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
