"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote: "Colaborarea cu SummitSphere a fost una dintre cele mai clare și bine structurate experiențe de proiect pe care le-am avut. Viziunea strategică și atenția la detalii au făcut procesul de dezvoltare eficient.",
    author: "Echipa NextDev",
    role: "Partener Tehnologic",
    logo: "/images/parteneri/nextdev.png",
  },
  {
    quote: "Un parteneriat exemplar, cu organizare impecabilă și focus real pe valoare medicală. Evenimentele SummitSphere ridică standardele în educația continuă din România.",
    author: "Dr. Heribert Moellinger",
    role: "Consultant Internațional Chirurgie",
    logo: "/images/parteneri/Dr.Moe.png",
  },
  {
    quote: "Colaborarea a fost fluidă, profesionistă și extrem de bine coordonată. Se simte expertiza și pasiunea pentru excelență în fiecare detaliu.",
    author: "Echipa Crisia Farm",
    role: "Distribuție Farmaceutică & Servicii Integrate",
    logo: "/images/parteneri/logo-crisia.png",
  },
  {
    quote: "Un nivel foarte ridicat de seriozitate și inovație în abordare. Ne-am simțit parteneri reali, nu doar furnizori.",
    author: "Echipa Atelierul",
    role: "Agenție de Branding & Creație",
    logo: "/images/parteneri/AD.png",
  },
  {
    quote: "Parteneriatul cu SummitSphere aduce plus valoare reală societății medicale prin evenimente de calitate superioară și structură științifică solidă.",
    author: "SREG",
    role: "Societatea Română de Endocrinologie Ginecologică",
    logo: "/images/parteneri/sreg.png",
  },
];

// ── Spotlight cursor effect ────────────────────────────────────────────────
function Spotlight() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(45,154,143,0.07), transparent 70%)`,
      }}
    />
  );
}

// ── Animated quote marks ───────────────────────────────────────────────────
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 32V19.2C0 8.533 5.333 2.4 16 0l2.4 4C13.067 5.333 10.4 8.533 10.4 13.6H16V32H0zm24 0V19.2C24 8.533 29.333 2.4 40 0l2.4 4C37.067 5.333 34.4 8.533 34.4 13.6H40V32H24z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Shimmer border card ────────────────────────────────────────────────────
function ShimmerCard({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <div className="relative group">
      {/* Animated border gradient */}
      <div
        className={`absolute -inset-[1px] rounded-3xl transition-opacity duration-700 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(45,154,143,0.8) 0%, rgba(45,154,143,0.1) 40%, rgba(45,154,143,0.6) 100%)",
        }}
      />
      <div className="relative rounded-3xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
        {children}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function TestimonialsAceternity() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoplay, active]);

  const handleSelect = (index: number) => {
    setActive(index);
    setAutoplay(false);
  };

  return (
    <section className="relative  min-h-screen py-12 bg-white dark:bg-neutral-950 overflow-hidden mt-5">
      <Spotlight />

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,154,143,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,154,143,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white dark:from-neutral-950 to-transparent z-10" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent z-10" />

      <div className="relative z-20 max-w-6xl mx-auto px-6">

   

        {/* ── Quote card ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ShimmerCard active={true}>
            <div className="px-8 py-5 md:px-16 md:py-10 ">
      

              {/* Quote text */}
              <div className="relative min-h-[140px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={active}
                    initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xl md:text-2xl font-medium leading-relaxed text-neutral-700 dark:text-neutral-300 italic text-justify"
                  >
                    „{testimonials[active].quote}"
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              {/* Author + dots — layout stabil, nu se remontează */}
              <div className="mt-10 flex items-center gap-4">
                {/* Avatar cu logo — animat independent */}
                <div className="relative w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`logo-${active}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center p-2"
                    >
                      <Image
                        src={testimonials[active].logo}
                        alt={testimonials[active].author}
                        width={52}
                        height={52}
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Nume + rol — animat independent */}
                <div className="min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`name-${active}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-lg font-black text-neutral-900 dark:text-white tracking-tight">
                        {testimonials[active].author}
                      </p>
                      <p className="text-xs font-medium tracking-widest  text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {testimonials[active].role}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress dots — STABILE, nu dispar niciodată */}
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      aria-label={`Testimonial ${i + 1}`}
                      className="focus:outline-none py-2"
                    >
                      <motion.div
                        animate={{
                          width:           i === active ? 28 : 8,
                          backgroundColor: i === active ? "#2D9A8F" : "#d1d5db",
                          opacity:         i === active ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-2 rounded-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ShimmerCard>
        </motion.div>

        {/* ── Logo selector ─────────────────────────────────────────────── */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {testimonials.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D9A8F] rounded-2xl"
            >
              {/* Card bg */}
              <div
                className={`relative w-28 h-28 md:w-32 md:h-32 rounded-2xl flex items-center justify-center p-3 border transition-all duration-300 ${
                  active === index
                    ? "bg-[#2D9A8F]/5 border-[#2D9A8F]/40 shadow-lg shadow-[#2D9A8F]/10"
                    : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={item.logo}
                  alt={item.author}
                  width={96}
                  height={96}
                  className={`object-contain transition-all duration-300 ${
                    active === index ? "grayscale-0" : "grayscale"
                  }`}
                />

                {/* Active indicator ring */}
                {active === index && (
                  <motion.div
                    layoutId="activeRing"
                    className="absolute inset-0 rounded-2xl border-2 border-[#2D9A8F]/50"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              {/* Autoplay progress bar */}
              {active === index && autoplay && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D9A8F] rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: "linear" }}
                  key={`progress-${active}`}
                />
              )}
            </motion.button>
          ))}
        </div>

      </div>
    </section>
  );
}