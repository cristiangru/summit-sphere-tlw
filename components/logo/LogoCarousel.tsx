"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
  wrap,
} from "framer-motion";

const logos = [
  { src: "/images/parteneri/Dr.Moe.png", alt: "Dr Moe" },
  { src: "/images/parteneri/nextdev.png", alt: "NextDev" },
  { src: "/images/parteneri/logo-crisia.png", alt: "Crisia" },
  { src: "/images/parteneri/AD.png", alt: "AD" },
  { src: "/images/parteneri/sreg.png", alt: "SREG" },
];

export const LogoCarousel = () => {
  const x = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // LOGOURI MICI: 120px + 64px gap
  const LOGO_WIDTH = 120; 
  const GAP = 64; 
  const ITEM_WIDTH = LOGO_WIDTH + GAP;
  const SINGLE_CYCLE_WIDTH = ITEM_WIDTH * logos.length;

  // Fix pentru eroarea de tip: transformăm MotionValue prin useTransform
  const xWrapped = useTransform(x, (v) => wrap(-SINGLE_CYCLE_WIDTH, 0, v));

  useAnimationFrame((_, delta) => {
    if (isPaused) return;
    x.set(x.get() - (35 * delta) / 1000); 
  });

  return (
    <div className="py-12 bg-white overflow-hidden relative border-y border-zinc-100">
      <div className="relative flex items-center">
        <motion.div
          className="flex items-center gap-16 whitespace-nowrap will-change-transform"
          style={{ x: xWrapped }}
          onHoverStart={() => setIsPaused(true)}
          onHoverEnd={() => setIsPaused(false)}
        >
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <div key={idx} className="flex-shrink-0 flex items-center justify-center w-[120px]">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={110}
                height={50}
                className="object-contain opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
              />
            </div>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </div>
  );
};