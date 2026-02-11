"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { Plus, Minus, ArrowRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────── */
/* CometCard – aceternity style + teal glow      */
/* ────────────────────────────────────────────── */
const CometCard = ({
  rotateDepth = 12,
  translateDepth = 18,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );

  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const glareBackground = useMotionTemplate`
    radial-gradient(
      circle at ${glareX}% ${glareY}%,
      rgba(255,255,255,0.65),
      transparent 70%
    )
  `;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div className={cn("perspective-[1200px] w-full", className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{ rotateX, rotateY, translateX, translateY }}
        className="
          relative rounded-3xl overflow-hidden
          border border-neutral-200/60 dark:border-neutral-800/60
          bg-white/80 dark:bg-neutral-950
          backdrop-blur-xl
          shadow-[0_25px_80px_-30px_rgba(0,0,0,0.4)]
        "
      >
        {/* Teal ambient glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#2D9A8F]/20 blur-3xl" />

        {children}

        {/* Glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
          style={{ background: glareBackground }}
        />
      </motion.div>
    </div>
  );
};

/* ────────────────────────────────────────────── */
/* FAQ Section - Classic Q&A                     */
/* ────────────────────────────────────────────── */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: "Ce tipuri de evenimente organizați?",
      a: "SummitSphere organizează o gamă variată de evenimente în domeniul medical, inclusiv conferințe, simpozioane, workshopuri și evenimente de networking, toate concepute pentru a sprijini educația continuă și schimbul de cunoștințe între profesioniștii din sănătate.",
    },
    {
      q: "Care este scopul principal al evenimentelor SummitSphere?",
      a: "Scopul principal al evenimentelor noastre este de a aduce împreună profesioniști din domeniul sănătății pentru a facilita învățarea continuă, schimbul de cunoștințe și colaborarea, contribuind astfel la evoluția sectorului medical.",
    },
    {
      q: "Ce valori promovează SummitSphere?",
      a: "Valorile noastre fundamentale sunt inovația, colaborarea, integritatea și calitatea. Ne concentrăm pe livrarea unor evenimente de înaltă calitate care reflectă cele mai recente tendințe din domeniul medical și ne angajăm să sprijinim dezvoltarea continuă a profesioniștilor din acest sector.",
    },
    {
      q: "Cum asigură SummitSphere succesul evenimentelor sale?",
      a: "SummitSphere asigură succesul evenimentelor printr-o abordare atentă și detaliată, care include o selecție riguroasă a speakerilor, un concept creativ solid, și o execuție perfectă. Fiecare detaliu este gândit pentru a livra o experiență memorabilă și valoroasă pentru participanți.",
    },
  ];

  return (
<section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-7 pb-20 sm:pb-24 lg:pb-28">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_20%_20%,rgba(45,154,143,0.12),transparent_40%),
                radial-gradient(circle_at_80%_30%,rgba(0,0,0,0.08),transparent_45%),
                radial-gradient(circle_at_50%_80%,rgba(45,154,143,0.08),transparent_50%)]
          "
        />
        <div className="absolute inset-0 bg-noise opacity-[0.035]" />
      </div>

    

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* FAQ List */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
          
          
              viewport={{ once: true }}
              className="
                group rounded-2xl overflow-hidden
                border border-neutral-200/70 dark:border-neutral-800/70
                bg-white/70 dark:bg-neutral-900/60
                backdrop-blur-xl
                transition-all duration-300
                hover:border-[#2D9A8F]/40
                hover:shadow-lg
              "
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 sm:py-6 flex items-center justify-between text-left"
              >
                <span className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-[#2D9A8F] transition-colors pr-4">
                  {item.q}
                </span>
                <motion.div
             
                  className="flex-shrink-0"
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D9A8F]" />
                  ) : (
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:text-[#2D9A8F] transition-colors" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                
                  >
                <div className="px-6 pt-4 pb-6 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 border-t border-neutral-200/60 dark:border-neutral-800/60 leading-relaxed text-justify">
  {item.a}
</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Right Card */}
        <div className="flex justify-center lg:justify-end lg:sticky lg:top-24">
          <CometCard className="max-w-[480px]">
            <div className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center h-[420px] sm:h-[500px]">
              {/* Animated background elements */}
              <motion.div
             
       
                className="absolute inset-0 bg-gradient-to-br from-[#2D9A8F]/5 to-transparent pointer-events-none"
              />

              {/* Icon */}
              <motion.div
            
                className="relative mb-6"
              >
                <div className="relative">
                  <Lightbulb className="w-20 h-20 sm:w-24 sm:h-24 text-[#2D9A8F]" />
                  <motion.div
                  
                    className="absolute inset-0 blur-2xl bg-[#2D9A8F]/30 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
              
                className="relative z-10 space-y-4"
              >
                <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  Nu ai găsit răspunsul?
                </p>

                <p className="text-neutral-600 dark:text-neutral-400">
                  Contactează-ne direct și voi răspunde la toate întrebările tale.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.a
             
                href="mailto:office@summitsphere.ro"
                className="
                  relative z-10 mt-8 inline-flex items-center gap-2 px-6 sm:px-8 py-3
                  rounded-xl font-semibold
                  bg-[#2D9A8F] text-white
                  hover:bg-[#248480]
                  shadow-lg hover:shadow-xl
                  transition-all
                "
              >
                Contactează-ne
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </CometCard>
        </div>
      </div>
    </section>
  );
}