"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
import "yet-another-react-lightbox/styles.css";

// ────────────────────────────────────────────────
// Adăugat doar asta: descrierile pentru fiecare tab
// ────────────────────────────────────────────────
const tabDescriptions = {
  LMBT: "Lemon Bottle România",
  BHRT: "Introducere în terapia de substituție hormonală bioidentică",
  LAA: "Longevity & Anti-Aging",
  SH: "Substituție Hormonală",
  SREG: "Biocosmosul Frumuseții – când pielea vorbește și știința ascultă",
};

export default function PortofoliuResponsive() {
  const [activeTab, setActiveTab] = useState("LMBT");
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const imageSets = useMemo(() => ({
    LMBT: ["/images/portofoliu/LMBT/5.jpg", "/images/portofoliu/LMBT/6.jpg", "/images/portofoliu/LMBT/7.jpg", "/images/portofoliu/LMBT/8.jpg", "/images/portofoliu/LMBT/9.jpg"],
    BHRT: Array.from({ length: 15 }, (_, i) => `/images/portofoliu/BHRT/${i + 10}.jpg`),
    LAA: Array.from({ length: 46 }, (_, i) => `/images/portofoliu/LAA/p${i + 1}.jpg`),
    SH: Array.from({ length: 16 }, (_, i) => `/images/portofoliu/SH/p${i + 1}.jpg`),
    SREG: ["/images/portofoliu/SREG/1.jpg", "/images/portofoliu/SREG/2.jpg", "/images/portofoliu/SREG/3.jpg", "/images/portofoliu/SREG/4.jpg"],
  }), []);

  const currentImages = imageSets[activeTab as keyof typeof imageSets] || [];

  // Adăugat: descrierea curentă bazată pe tab-ul activ
  const currentDescription = tabDescriptions[activeTab as keyof typeof tabDescriptions] || "";

  return (
    <main className="bg-white min-h-screen overflow-x-hidden mt-20">
   
      {/* TABS - nemodificat */}
      <div className="flex justify-center px-4 mb-12">
        <nav className="flex flex-wrap justify-center gap-2 p-2 bg-white backdrop-blur-md border border-zinc-200 rounded-2xl md:rounded-full">
          {Object.keys(imageSets).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-2 md:px-8 md:py-2.5 text-sm md:text-base font-bold transition-all rounded-full"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-black/10 dark:bg-neutral-800/50 pointer-events-none rounded-full shadow-lg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === tab ? "text-black" : "text-black"}`}>
                {tab}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* ────────────────────────────────────────────────
          Adăugat DOAR asta: descrierea sub tab-uri
          ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeTab}
  
          className="text-center text-lg md:text-2xl  text-black font-bold mb-10 max-w-3xl mx-auto px-4"
        >
          {currentDescription}
        </motion.p>
      </AnimatePresence>

      {/* Grid-ul de imagini - NEMODIFICAT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ParallaxScroll
            images={currentImages}
            onImageClick={(idx) => {
              setPhotoIndex(idx);
              setIsOpen(true);
            }}
          />
        </motion.div>
      </AnimatePresence>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={currentImages.map((src) => ({ src }))}
      />
    </main>
  );
}