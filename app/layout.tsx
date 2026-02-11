import type { Metadata } from "next";

import "./globals.css";
import { Navbar } from "@/components/NavBar";
import Footer from "@/components/Footer";



export const metadata: Metadata = {
  title: "SummitSphere - Platforma Liderilor în Sănătate",
  description: "Conectează-te cu liderul din sănătate. Evenimente de impact, conexiuni reale și creștere continuă.",
  keywords: "conferință medicală, liderul în sănătate, eveniment healthcare, România",
  authors: [{ name: "SummitSphere" }],
  openGraph: {
    title: "SummitSphere - Platforma Liderilor în Sănătate",
    description: "Conectează-te cu liderul din sănătate. Evenimente de impact, conexiuni reale și creștere continuă.",
    url: "https://summitsphere.ro",
    siteName: "SummitSphere",
    images: [
      {
        url: "https://summitsphere.ro/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SummitSphere - Platforma Liderilor în Sănătate",
    description: "Conectează-te cu liderul din sănătate. evenimente de impact, conexiuni reale și creștere continuă.",
    images: ["https://summitsphere.ro/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className="antialiased bg-white"
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}