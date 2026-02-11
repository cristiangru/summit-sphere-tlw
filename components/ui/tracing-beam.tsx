"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
} from "framer-motion"; // motion/react sau framer-motion, ambele merg
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  // 1. Monitorizăm înălțimea conținutului (Best Practice pentru pagini dinamice)
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // 2. Ajustăm scroll-ul să înceapă puțin mai târziu (offset) pentru a nu lovi Navbar-ul
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 10%", "end start"],
  });

  const springConfig = { stiffness: 500, damping: 90 };

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [20, svgHeight]),
    springConfig
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [20, svgHeight - 100]),
    springConfig
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto h-full w-full max-w-4xl", className)}
    >
      {/* 3. Ascundem fasciculul pe ecrane foarte mici (sub 768px) pentru a evita suprapunerea peste text */}
      <div className="absolute -left-4 md:-left-20 top-0 h-full hidden md:block">
        <motion.div
          animate={{
            boxShadow: scrollYProgress.get() > 0 ? "none" : "rgba(0, 0, 0, 0.2) 0px 3px 8px",
          }}
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-neutral-200 shadow-sm"
        >
          <motion.div
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? "white" : "#10b981",
              borderColor: scrollYProgress.get() > 0 ? "white" : "#059669",
            }}
            className="h-2 w-2 rounded-full border border-neutral-300 bg-white"
          />
        </motion.div>

        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#9091A0"
            strokeOpacity="0.16"
            strokeWidth="1.25"
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1.5"
            className="motion-reduce:hidden"
          />
      <defs>
  <motion.linearGradient
    id="gradient"
    gradientUnits="userSpaceOnUse"
    x1="0"
    x2="0"
    y1={y1}
    y2={y2}
  >
    {/* Începutul gradientului (Transparent spre Culoarea ta) */}
    <stop stopColor="#2D9A8F" stopOpacity="0" />
    <stop stopColor="#2D9A8F" />
    
    {/* Mijlocul gradientului (Culoarea ta de bază) */}
    <stop offset="0.5" stopColor="#2D9A8F" />
    
    {/* Finalul gradientului (Spre Cyan-500) */}
    <stop offset="1" stopColor="#06b6d4" stopOpacity="0" /> 
    {/* #06b6d4 este codul HEX pentru cyan-500 din Tailwind */}
  </motion.linearGradient>
</defs>
        </svg>
      </div>

      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </motion.div>
  );
};