"use client";
import React, { useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Component
      className={cn(
        "relative h-11 w-25 overflow-hidden bg-transparent text-sm group",
        isHovered ? "p-[1.5px]" : "p-[1px]",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...otherProps}
    >
      {/* Moving border - default state */}
      {!isHovered && (
        <div
          className="absolute inset-0"
          style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
        >
          <MovingBorder duration={duration} rx="30%" ry="30%">
            <div
              className={cn(
                "h-12 w-12 bg-[radial-gradient(#2D9A8F_40%,transparent_60%)] opacity-[0.8]",
                borderClassName,
              )}
            />
          </MovingBorder>
        </div>
      )}

      {/* Hover - subtle gradient border */}
      {isHovered && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#2D9A8F]/60 via-[#2D9A8F]/40 to-[#2D9A8F]/60"
          style={{
            borderRadius: `calc(${borderRadius} * 0.96)`,
          }}
        />
      )}

      {/* Main content */}
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center bg-slate-900/[0.8] transition-all duration-300",
          isHovered ? "border-none" : "border border-slate-800",
          "text-xs sm:text-sm text-white antialiased backdrop-blur-xl",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length && length > 0) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => {
      try {
        const point = pathRef.current?.getPointAtLength(val);
        return point?.x ?? 0;
      } catch {
        return 0;
      }
    }
  );
  
  const y = useTransform(
    progress,
    (val) => {
      try {
        const point = pathRef.current?.getPointAtLength(val);
        return point?.y ?? 0;
      } catch {
        return 0;
      }
    }
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};