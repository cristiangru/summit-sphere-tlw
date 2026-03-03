import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/cookies/CookieBanner";
import GoogleAnalytics from "@/components/cookies/GoogleAnalytics";
import { env } from "@/lib/env";

import { ClerkProvider } from "@clerk/nextjs";

// Best Practice 2026: Definirea separată a viewport pentru performanță
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://summitsphere.ro"), // Esențial pentru rezolvarea corectă a URL-urilor imaginilor OG
  title: {
    default: "SummitSphere - Platforma Liderilor în Sănătate",
    template: "%s | SummitSphere", // Permite paginilor interne să adauge titluri dinamice
  },
  description:
    "Conectează-te cu liderul din sănătate. Evenimente de impact, conexiuni reale și creștere continuă.",
  keywords: [
    "conferință medicală",
    "liderul în sănătate",
    "eveniment healthcare",
    "România",
    "SummitSphere",
  ],
  authors: [{ name: "SummitSphere", url: "https://summitsphere.ro" }],
  creator: "SummitSphere",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SummitSphere - Platforma Liderilor în Sănătate",
    description:
      "Conectează-te cu liderul din sănătate. Evenimente de impact, conexiuni reale și creștere continuă.",
    url: "https://summitsphere.ro",
    siteName: "SummitSphere",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Next.js va folosi metadataBase pentru a genera URL-ul complet
        width: 1200,
        height: 630,
        alt: "SummitSphere - Evenimente Medicale de Elită",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SummitSphere - Platforma Liderilor în Sănătate",
    description: "Conectează-te cu liderul din sănătate.",
    images: ["/twitter-image.png"],
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
    <ClerkProvider>
      <html lang="ro" className="scroll-smooth" suppressHydrationWarning>
        <body className="antialiased bg-white dark:bg-black text-slate-900 dark:text-slate-50 selection:bg-emerald-500/30">
          {/* SISTEM DE ANALYTICS (Injected Early)
            ID-ul tău trebuie să fie în format G-XXXXXXXXXX 
        */}
          <GoogleAnalytics GA_ID="G-XXXXXXXXXX" />

          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main id="main-content" className="flex-1 relative outline-none">
              {children}
            </main>

            <Footer />
          </div>

          {/* --- UI CONSIMȚĂMÂNT (Client Component) --- */}
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
