"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const testimonials = [
  {
    quote: "Un standard organizatoric foarte ridicat și o experiență profesională valoroasă. Se vede atenția pentru detalii și respectul pentru comunitatea medicală.",
    name: "Dr. S. Petrescu",
    title: "Medic primar dermatologie",
  },
  {
    quote: "Un eveniment organizat la standarde foarte ridicate, cu o structură științifică bine definită și o experiență profesională real valoroasă. Totul a fost gestionat impecabil.",
    name: "Dr. A. Popescu",
    title: "Medic primar obstetrică-ginecologie",
  },
  {
    quote: "Un mediu profesionist care a facilitat dialogul real între specialiști și schimbul de bune practici. Organizarea a susținut perfect componenta științifică.",
    name: "Dr. C. Marinescu",
    title: "Medic primar obstetrică-ginecologie",
  },
  {
    quote: "Un eveniment foarte bine coordonat, cu o atmosferă deschisă și profesionistă. Experiența a fost valoroasă atât științific, cât și la nivel de interacțiune.",
    name: "Dr. R. Dumitrescu",
    title: "Medic specialist pediatrie",
  },
  {
    quote: "O experiență profesională foarte bine construită, care a facilitat schimbul de idei într-un cadru organizat și eficient. Standardele au fost excelente.",
    name: "Dr. D. Stănescu",
    title: "Medic specialist obstetrică-ginecologie",
  },
];

const CARD_GAP = 24;

export default function TestimonialCarousel() {
  const trackRef      = useRef<HTMLDivElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const [cardWidth,   setCardWidth]   = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered,    setIsHovered]   = useState(false);
  const [isDragging,   setIsDragging]  = useState(false);
  const autoplayRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  const x          = useMotionValue(0);
  const dragStartX = useRef(0);
  const dragStartMotionX = useRef(0);


  // ── Recalculate card width on resize — responsive ────────────────────────
  const [cardsShown, setCardsShown] = useState(3);
  const maxIndex = testimonials.length - cardsShown;

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth;
      // 1 card pe mobile (<640px), 2 pe tablet (<1024px), 3 pe desktop
      const cols = containerW < 640 ? 1 : containerW < 1024 ? 2 : 3;
      setCardsShown(cols);
      const w = (containerW - CARD_GAP * (cols - 1)) / cols;
      setCardWidth(w);
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Animate to index ──────────────────────────────────────────────────────
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setActiveIndex(clamped);
      animate(x, -(clamped * (cardWidth + CARD_GAP)), {
        type:      "spring",
        stiffness: 280,
        damping:   32,
        mass:      0.8,
      });
    },
    [cardWidth, maxIndex, x]
  );

  // ── Autoplay — pauses on hover ────────────────────────────────────────────
  useEffect(() => {
    if (isHovered || cardWidth === 0) return;
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        animate(x, -(next * (cardWidth + CARD_GAP)), {
          type: "spring", stiffness: 280, damping: 32, mass: 0.8,
        });
        return next;
      });
    }, 5500);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isHovered, cardWidth, maxIndex, x]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      dragStartX.current =
        "touches" in e ? e.touches[0].clientX : e.clientX;
      dragStartMotionX.current = x.get();
    },
    [x]
  );

  const onDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const delta   = clientX - dragStartX.current;
      x.set(dragStartMotionX.current + delta * 0.85); // slight resistance
    },
    [isDragging, x]
  );

  const onDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const clientX =
        "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const delta   = clientX - dragStartX.current;
      const threshold = cardWidth * 0.25;

      if (Math.abs(delta) > threshold) {
        goTo(delta < 0 ? activeIndex + 1 : activeIndex - 1);
      } else {
        goTo(activeIndex); // snap back
      }
    },
    [isDragging, cardWidth, activeIndex, goTo]
  );

  const canLeft  = activeIndex > 0;
  const canRight = activeIndex < maxIndex;

  return (
    <section className="pt-28 pb-16 md:pt-27 md:pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header + Navigation ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#2D9A8F] mb-2">
              Feedback
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Ce spun participanții
            </h2>
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-3">
            <NavButton
              direction="left"
              disabled={!canLeft}
              onClick={() => goTo(activeIndex - 1)}
            />
            <NavButton
              direction="right"
              disabled={!canRight}
              onClick={() => goTo(activeIndex + 1)}
            />
          </div>
        </div>

        {/* ── Track ──────────────────────────────────────────────────── */}
        {/* 
          Wrapper cu overflow:hidden + padding-top pentru a nu tăia 
          partea de sus a cardurilor la hover (y: -8px)
        */}
        <div
          className="overflow-hidden"
          style={{ paddingTop: 12, marginTop: -12 }}
        >
          <div
            ref={containerRef}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isDragging) {
                setIsDragging(false);
                goTo(activeIndex);
              }
            }}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <motion.div
              ref={trackRef}
              className="flex"
              style={{ x, gap: CARD_GAP }}
            >
              {testimonials.map((t, i) => {
                const isActive = i === activeIndex;
                return (
                  <motion.div
                    key={i}
                    style={{ width: cardWidth || "33.333%", flexShrink: 0 }}
                    animate={{ y: hoveredIndex === i && !isDragging ? -8 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div
                      className={`
                        h-full rounded-[2rem] p-10 flex flex-col justify-between
                        min-h-[380px] border transition-all duration-500 select-none
                        ${hoveredIndex === i && !isDragging
                          ? "border-[#2D9A8F]/40 shadow-2xl shadow-[#2D9A8F]/8"
                          : isActive
                          ? "border-[#2D9A8F]/20 shadow-md"
                          : "border-slate-200 shadow-sm"
                        }
                      `}
                    >
                      {/* Quote */}
                      <p className="text-[18px] md:text-[19px] leading-[1.65] text-slate-700 font-normal italic tracking-tight">
                        „{t.quote}"
                      </p>

                      {/* Author */}
                      <div className="mt-8 pt-7 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          {/* Initials avatar */}
                          <div className="w-10 h-10 rounded-xl bg-[#2D9A8F]/10 border border-[#2D9A8F]/20 flex items-center justify-center shrink-0">
                            <span className="text-sm font-black text-[#2D9A8F]">
                              {t.name.split(" ").pop()?.charAt(0) ?? "D"}
                            </span>
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-base tracking-tight leading-tight">
                              {t.name}
                            </p>
                            <p className="text-xs text-[#2D9A8F] font-semibold mt-0.5 tracking-wide uppercase">
                              {t.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── Progress dots ───────────────────────────────────────────── */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {Array.from({ length: Math.max(1, testimonials.length - cardsShown + 1) }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="focus:outline-none py-2"
            >
              <motion.div
                animate={{
                  width:           i === activeIndex ? 28 : 8,
                  backgroundColor: i === activeIndex ? "#2D9A8F" : "#cbd5e1",
                  opacity:         i === activeIndex ? 1 : 0.5,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-1.5 rounded-full"
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── NavButton ──────────────────────────────────────────────────────────────

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.08, borderColor: "#2D9A8F" }}
      whileTap={disabled ? {} : { scale: 0.93 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`
        w-12 h-12 rounded-full border flex items-center justify-center
        transition-colors duration-200 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-[#2D9A8F]
        ${disabled
          ? "border-slate-200 text-slate-300 cursor-not-allowed"
          : "border-slate-300 text-slate-600 hover:text-[#2D9A8F] cursor-pointer"
        }
      `}
    >
      {direction === "left"
        ? <ChevronLeft size={20} />
        : <ChevronRight size={20} />
      }
    </motion.button>
  );
}