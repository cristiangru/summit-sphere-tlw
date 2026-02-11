"use client";

import React from "react";
import { motion } from "framer-motion";
import { TracingBeam } from "@/components/ui/tracing-beam";

// Interfață pentru siguranța tipurilor
interface CookieItem {
  title: string;
  description: React.ReactNode;
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50/30 to-white dark:from-neutral-950/30 dark:to-neutral-950 py-16 md:py-32 mt-5 antialiased leading-relaxed font-trebuchet">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center md:text-left mb-16 md:mb-24"
        >
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="text-black dark:text-white">
              Politica de
            </span>{" "}
            <br className="sm:hidden" />
            <span className="text-neutral-900 dark:text-white">Cookies</span>
          </h1>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-5">
            <div className="h-1.5 w-20 rounded-full bg-linear-to-r from-[#2D9A8F] to-[#06b6d4]" />
          </div>

          <p className="mt-10 text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed italic max-w-3xl mx-auto md:mx-0">
            SummitSphere utilizează modulele cookies pentru a vă oferi o experiență de navigare superioară și personalizată.
          </p>
        </motion.div>

        {/* Conținut principal */}
        <TracingBeam className="px-2 sm:px-0">
          <div className="space-y-16 md:space-y-24 prose prose-lg prose-neutral dark:prose-invert max-w-none">
            {cookieContent.map((item: CookieItem, index: number) => (
              <motion.section
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                <h2 className="text-2xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8 not-italic">
                  {item.title}
                </h2>

                <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-[1.05rem] md:text-lg text-justify">
                  {item.description}
                </div>
              </motion.section>
            ))}
          </div>
        </TracingBeam>
      </div>
    </div>
  );
}

const cookieContent: CookieItem[] = [
  {
    title: "1. Introducere",
    description: (
      <>
        <p className="mb-4">Această Politică de Cookies descrie modul în care SummitSphere SRL utilizează modulele cookies și tehnologii similare pe site-ul său oficial, în scopul îmbunătățirii experienței de navigare și pentru analizarea comportamentului utilizatorilor.</p>
        <p>Prin continuarea navigării pe site-ul nostru, utilizatorul își exprimă acordul privind utilizarea cookies, conform acestei politici și Politicii de Confidențialitate aplicabile.</p>
      </>
    ),
  },
  {
    title: "2. Ce sunt Cookies?",
    description: (
      <p>Cookies sunt fișiere de mici dimensiuni, stocate pe dispozitivul utilizatorului (computer, telefon, tabletă) atunci când vizitează un site web. Acestea permit site-ului să recunoască dispozitivul și să rețină anumite informații despre preferințele sau activitățile anterioare ale utilizatorului.</p>
    ),
  },
  {
    title: "3. Tipuri de Cookies Utilizate",
    description: (
      <ul className="space-y-4 list-none pl-0">
        <li className="flex gap-2"><strong>✓ Cookies necesare:</strong> Asigură funcționarea corectă și sigură a site-ului (ex: autentificare, navigare în pagini protejate).</li>
        <li className="flex gap-2"><strong>✓ Cookies de performanță:</strong> Colectează informații anonime despre modul de utilizare a site-ului pentru a îmbunătăți funcționalitatea (ex: pagini vizitate, erori întâlnite).</li>
        <li className="flex gap-2"><strong>✓ Cookies de marketing și targetare:</strong> Permite personalizarea conținutului publicitar și adaptarea ofertelor în funcție de interesele utilizatorului.</li>
        <li className="flex gap-2"><strong>✓ Cookies analitice:</strong> Ajută la măsurarea traficului și la analizarea comportamentului utilizatorilor pentru optimizarea continuă a site-ului.</li>
      </ul>
    ),
  },
  {
    title: "4. Scopul Utilizării Cookies",
    description: (
      <ul className="space-y-2 list-none pl-0">
        <li>✓ Îmbunătățirea performanței și funcționalității site-ului;</li>
        <li>✓ Personalizarea experienței utilizatorului;</li>
        <li>✓ Analizarea traficului și optimizarea conținutului;</li>
        <li>✓ Oferirea de reclame adaptate intereselor utilizatorului (acolo unde este cazul);</li>
        <li>✓ Asigurarea securității și detectarea tentativelor de fraudă.</li>
      </ul>
    ),
  },
  {
    title: "5. Controlul asupra Cookies",
    description: (
      <>
        <p className="mb-4">Utilizatorii au control complet asupra utilizării cookies:</p>
        <ul className="space-y-2 list-none pl-0 mb-6">
          <li>✓ Puteți seta browserul dumneavoastră să blocheze sau să accepte cookies.</li>
          <li>✓ Puteți șterge cookies deja instalate de pe dispozitivul dumneavoastră.</li>
          <li>✓ De asemenea, puteți modifica setările cookies din bannerele dedicate afișate la prima accesare a site-ului.</li>
        </ul>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-neutral-900 dark:text-neutral-100 font-bold">
          ⚠️ Dezactivarea cookies esențiale poate afecta funcționarea corectă a anumitor secțiuni ale site-ului.
        </div>
      </>
    ),
  },
  {
    title: "6. Cookies Terțe Părți",
    description: (
      <>
        <p className="mb-4">Site-ul nostru poate utiliza cookies plasate de terți (de exemplu: Google Analytics, Facebook Pixel) pentru:</p>
        <ul className="space-y-2 list-none pl-0 mb-4">
          <li>✓ Analiză statistică;</li>
          <li>✓ Remarketing și publicitate personalizată.</li>
        </ul>
        <p>Utilizarea acestor cookies este reglementată de politicile respective ale furnizorilor terți.</p>
      </>
    ),
  },
  {
    title: "7. Actualizarea Politicii de Cookies",
    description: (
      <p>SummitSphere SRL își rezervă dreptul de a modifica oricând această Politică de Cookies, pentru a reflecta schimbările legislative sau modificările în funcționarea site-ului. Versiunea actualizată va fi publicată pe această pagină, cu intrare în vigoare imediată.</p>
    ),
  },
];