"use client";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export const ParallaxScroll = ({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick?: (index: number) => void;
}) => {
  const containerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Animația se aplică doar de la desktop în sus pentru a evita problemele pe mobil
  const y1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, 200]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, -300]);

  const third = Math.ceil(images.length / 3);
  const parts = [
    images.slice(0, third),
    images.slice(third, 2 * third),
    images.slice(2 * third),
  ];

  return (
    <div ref={containerRef} className="w-full bg-white overflow-hidden">
      {/* Grila: 1 coloana pe mobil, 2 pe tableta, 3 pe desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4 md:px-12 max-w-[1600px] mx-auto py-10">
        
        {parts.map((part, colIdx) => {
          // Alegem translația în funcție de coloană (doar pentru desktop)
          const yValues = [y1, y2, y3];
          return (
            <div key={colIdx} className="flex flex-col gap-4 md:gap-8">
              {part.map((src, imgIdx) => (
                <motion.div
                  key={src + imgIdx}
                  // Pe ecran mare folosim y, pe mobil (sub 1024px) folosim 0
                  style={{ y: typeof window !== 'undefined' && window.innerWidth > 1024 ? yValues[colIdx] : 0 }}
                  onClick={() => onImageClick?.(imgIdx + (colIdx * third))}
                  className="relative h-[40vh] md:h-[50vh] w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-zinc-100 cursor-pointer group shadow-sm"
                >
                  <Image
                    src={src}
                    fill
                    alt="Portofoliu"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};