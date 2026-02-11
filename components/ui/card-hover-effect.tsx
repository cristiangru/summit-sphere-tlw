"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 py-10 mb-20",
        className
      )}
    >
      {items.map((item, idx) => {
        const isHovered = hoveredIndex === idx;

        return (
          <motion.div
            key={item.link}
            className="group relative h-full"
            onHoverStart={() => setHoveredIndex(idx)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
          >
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-3xl pointer-events-none",
                    "bg-gradient-to-br from-[#2D9A8F]/10 via-[#2D9A8F]/5 to-transparent"
                  )}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  layoutId="hover-glow"
                />
              )}
            </AnimatePresence>

            <Card isHovered={isHovered}>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>

              <div className="mt-auto pt-6">
                <Link
                  href={item.link}
                  className={cn(
                    "group/btn inline-flex items-center gap-2 text-sm font-medium",
                    "text-neutral-900 hover:text-[#2D9A8F] transition-colors duration-300"
                  )}
                >
                  <span className="relative">
                    Mai mult
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 transition-all duration-300 ease-out",
                        "bg-[#2D9A8F]",
                        isHovered ? "w-full" : "w-0"
                      )}
                    />
                  </span>
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-[#2D9A8F]"
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

const Card = ({
  className,
  children,
  isHovered,
}: {
  className?: string;
  children: React.ReactNode;
  isHovered: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl",
        "bg-white border border-gray-200/70",
        "transition-all duration-400 ease-out",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        isHovered &&
          "shadow-[0_20px_60px_rgba(45,154,143,0.12)] border-[#2D9A8F]/30 scale-[1.015]",
        className
      )}
    >
      <div className="relative z-20 flex h-full flex-col p-6 md:p-7">
        {children}
      </div>
    </div>
  );
};

const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-xl md:text-2xl font-semibold tracking-tight text-gray-900",
        "group-hover:text-[#2D9A8F] transition-colors duration-300",
        className
      )}
    >
      {children}
    </h4>
  );
};

const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
   <p
      className={cn(
        "mt-3 text-base leading-relaxed text-gray-600",
        "text-justify [hyphens:auto]", // <-- Adaugă aceste clase
        "line-clamp-3 md:line-clamp-4",
        className
      )}
    >
      {children}
    </p>
  );
};