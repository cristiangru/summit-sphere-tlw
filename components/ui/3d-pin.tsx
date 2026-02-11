"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onMouseEnter = () => {
    if (!isMobile) {
      setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
    }
  };

  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <a
      className={cn(
        "relative group/pin z-50 cursor-pointer w-full",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}

    >
      <div
        style={{
          perspective: "1000px",
          transform: isMobile ? "rotateX(20deg) translateZ(0deg)" : "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2 w-full md:w-auto"
      >
        <div
          style={{
            transform: isMobile ? "translate(-50%,-50%) rotateX(0deg) scale(1)" : transform,
          }}
          className="absolute left-1/2 p-3 sm:p-4 md:p-6 top-1/2 flex justify-start items-start rounded-xl sm:rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-black border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-700 overflow-hidden"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} isMobile={isMobile} />
    </a>
  );
};

export const PinPerspective = ({
  title,
  href,
  isMobile,
}: {
  title?: string;
  href?: string;
  isMobile?: boolean;
}) => {
  return (
    <motion.div className="pointer-events-none w-full md:w-96 h-auto md:h-80 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className="w-full h-full -mt-7 flex-none inset-0">
        {/* Title Badge - Responsive */}
        <div className="absolute top-0 inset-x-0 flex justify-center px-4 md:px-0">
          <button
            onClick={() => href && window.open(href, "_blank")}
            className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-3 md:px-4 ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300 cursor-pointer"
          >
            <span className="relative z-20 text-white text-xs font-bold inline-block py-0.5 whitespace-nowrap truncate max-w-[200px] md:max-w-none">
              {title}
            </span>

            <span className="absolute -bottom-0 left-[0.875rem] md:left-[1.125rem] h-px w-[calc(100%-1.75rem)] md:w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover/btn:opacity-40"></span>
          </button>
        </div>

        {/* 3D Perspective Container */}
        <div
          style={{
            perspective: "1000px",
            transform: isMobile ? "rotateX(20deg) translateZ(0)" : "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Animated Ripple Circles */}
          {!isMobile && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{
                  opacity: [0, 1, 0.5, 0],
                  scale: 1,
                  z: 0,
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 0,
                }}
                className="absolute left-1/2 top-1/2 h-20 w-20 sm:h-32 sm:w-32 md:h-[11.25rem] md:w-[11.25rem] rounded-full bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              />
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{
                  opacity: [0, 1, 0.5, 0],
                  scale: 1,
                  z: 0,
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 2,
                }}
                className="absolute left-1/2 top-1/2 h-20 w-20 sm:h-32 sm:w-32 md:h-[11.25rem] md:w-[11.25rem] rounded-full bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              />
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{
                  opacity: [0, 1, 0.5, 0],
                  scale: 1,
                  z: 0,
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 4,
                }}
                className="absolute left-1/2 top-1/2 h-20 w-20 sm:h-32 sm:w-32 md:h-[11.25rem] md:w-[11.25rem] rounded-full bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
              />
            </>
          )}
        </div>

        {/* Light Rays - Responsive */}
        {!isMobile && (
<>
            {/* Glow-ul fasciculului - Pur Verde #2D9A8F */}
            <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-t from-[#2D9A8F] via-[#2D9A8F] to-transparent translate-y-[14px] w-[3px] h-20 sm:h-24 md:h-20 group-hover/pin:h-32 md:group-hover/pin:h-40 blur-[4px] opacity-80 transition-all duration-500" />
            
            {/* Linia centrală - Verde solid care se pierde în transparență */}
            <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-t from-[#2D9A8F] via-[#2D9A8F] to-transparent translate-y-[14px] w-px h-20 sm:h-24 md:h-20 group-hover/pin:h-32 md:group-hover/pin:h-40 transition-all duration-500" />
            
            {/* Punctul de ancorare - Aura Verde puternică */}
            <motion.div className="absolute right-1/2 translate-x-[2px] bottom-1/2 bg-[#2D9A8F] translate-y-[14px] w-[8px] h-[8px] rounded-full z-40 blur-[5px]" />
            
            {/* Punctul de ancorare - Nucleul Verde aprins */}
            <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-[#2D9A8F] translate-y-[14px] w-[3px] h-[3px] rounded-full z-40 shadow-[0_0_15px_5px_#2D9A8F]" />
          </>
        )}
      </div>
    </motion.div>
  );
};