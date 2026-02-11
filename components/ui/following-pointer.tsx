"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export const FollowerPointerCard = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [isInside, setIsInside] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }

    const handleResize = () => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rect) return;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    
    // Calculate position relative to the element
    const posX = e.clientX - rect.left + scrollX;
    const posY = e.clientY - rect.top + scrollY;

    x.set(posX);
    y.set(posY);
  };

  const handleMouseLeave = () => {
    setIsInside(false);
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      style={{
        cursor: "none",
      }}
      ref={ref}
      className={cn("relative overflow-hidden", className)}
    >
      <AnimatePresence mode="wait">
        {isInside && <FollowPointer x={x} y={y} title={title} />}
      </AnimatePresence>
      {children}
    </div>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
}: {
  x: any;
  y: any;
  title?: string | React.ReactNode;
}) => {
  const colors = [
    "#0ea5e9",
    "#737373",
    "#14b8a6",
    "#22c55e",
    "#3b82f6",
    "#ef4444",
    "#eab308",
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      className="absolute z-50 h-4 w-4 rounded-full pointer-events-none"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      {/* Pointer Arrow */}
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-sky-600 text-sky-500"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
      </svg>

      {/* Title Tooltip */}
      {title && (
        <motion.div
          style={{
            backgroundColor: randomColor,
          }}
          initial={{
            scale: 0.5,
            opacity: 0,
            y: -10,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.5,
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="absolute top-6 left-0 min-w-max rounded-full px-3 py-1.5 text-xs whitespace-nowrap text-white font-semibold shadow-lg"
        >
          {title}
        </motion.div>
      )}
    </motion.div>
  );
};