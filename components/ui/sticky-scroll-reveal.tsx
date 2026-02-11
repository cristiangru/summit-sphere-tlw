"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion"; // ← corectează importul (motion/react → framer-motion)
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end 85%"], // ← cheie: termină progresul mai devreme
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculăm procente mai „îngăduitoare” pentru ultimul card
    const cardsBreakpoints = content.map((_, index) => {
      // Primul card începe la 0, ultimul se termină la ~0.9–1
      return index / (cardLength - 0.5); // ← truc mic pentru ca ultimul să prindă mai ușor
    });

    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );

    // Forțăm ultimul card dacă suntem aproape de capăt
    if (latest > 0.92) {
      setActiveCard(cardLength - 1);
    } else {
      setActiveCard(closestBreakpointIndex);
    }
  });

  const backgroundColors = [
    "#f5f5f5",
    "#f0f0f0",
    "#fafafa",
  ];

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
    "linear-gradient(to bottom right, #8b5cf6, #d946ef)", // extra pentru al 4-lea și al 5-lea
    "linear-gradient(to bottom right, #14b8a6, #0ea5e9)",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
  <motion.div
  animate={{
    backgroundColor: backgroundColors[activeCard % backgroundColors.length],
  }}
className="relative flex h-screen min-h-[900px] justify-center space-x-10 overflow-y-auto rounded-lg p-8 md:p-12 lg:p-16 pb-20"  // ← aici reducem la pb-16
  ref={ref}
>
  <div className="relative flex items-start px-4">
    <div className="max-w-3xl">
      {content.map((item, index) => (
     <div key={item.title + index} className="my-16 md:my-24 lg:my-32">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: activeCard === index ? 1 : 0.4 }}
            transition={{ duration: 0.4 }}
            className="text-1xl md:text-2xl lg:text-3xl font-bold text-gray-900"
          >
            {item.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: activeCard === index ? 1 : 0.4 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base md:text-lg mt-6 md:mt-10 max-w-2xl text-gray-700 leading-relaxed text-justify"
          >
            {item.description}
          </motion.p>
        </div>
      ))}
      {/* Suficient spațiu jos, dar nu exagerat */}
   <div className="h-[30vh] min-h-[400px]" />   {/* ← redus de la 40vh/400px */}
    </div>
  </div>

   <div
  style={{ background: backgroundGradient }}
  className={cn(
    "sticky top-20 hidden h-[420px] w-80 overflow-hidden rounded-2xl shadow-2xl lg:block",
    contentClassName,
  )}
>
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
};