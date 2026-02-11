"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
  compareElementSelector = ".compare-demo-collision-target",
}: {
  children: React.ReactNode;
  className?: string;
  compareElementSelector?: string;
}) => {
  const parentRef = useRef<HTMLDivElement>(null!);

  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex items-center w-full justify-center overflow-hidden",
        className
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          parentRef={parentRef}
          compareElementSelector={compareElementSelector}
        />
      ))}

      {children}
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    parentRef: React.RefObject<HTMLDivElement>;
    compareElementSelector?: string;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, beamOptions = {}, compareElementSelector = ".compare-demo-collision-target" }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{ x: number; y: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [beamKey, setBeamKey] = useState(0);

  useEffect(() => {
    const checkCollisionOnce = () => {
      if (!beamRef.current || !parentRef.current) return;

      const beamRect = beamRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      
      const compareElement = document.querySelector(compareElementSelector) as HTMLElement | null;
      if (!compareElement) return;
      
      const compareRect = compareElement.getBoundingClientRect();

      // Calculate positions relative to parent
      const beamCenterX = beamRect.left - parentRect.left + beamRect.width / 2;
      const beamTop = beamRect.top - parentRect.top;
      
      const compareLeft = compareRect.left - parentRect.left;
      const compareRight = compareRect.right - parentRect.left;
      const compareTop = compareRect.top - parentRect.top;

      // Check if beam center is within compare bounds horizontally
      // AND if beam top is at or below compare top (collision point)
      if (
        beamCenterX >= compareLeft &&
        beamCenterX <= compareRight &&
        beamTop >= compareTop - 5 &&
        beamTop <= compareTop + 5 &&
        isAnimating
      ) {
        // Collision detected - explosion happens INSTANTLY
        setCollision({
          x: beamCenterX,
          y: compareTop,
        });
        setIsAnimating(false);
      }
    };

    // Check collision every frame
    const interval = setInterval(checkCollisionOnce, 16);
    return () => clearInterval(interval);
  }, [isAnimating, compareElementSelector, parentRef]);

  // Handle explosion end and restart
  useEffect(() => {
    if (!collision) return;

    const timer = setTimeout(() => {
      setCollision(null);
      setIsAnimating(true);
      setBeamKey(prev => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [collision]);

  return (
    <>
      {isAnimating && (
        <motion.div
          key={beamKey}
          ref={beamRef}
          initial={{
            translateY: beamOptions.initialY || "-200px",
            translateX: beamOptions.initialX || "0px",
          }}
          animate={{
            translateY: beamOptions.translateY || "1800px",
            translateX: beamOptions.translateX || "0px",
          }}
          transition={{
            duration: beamOptions.duration || 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beamOptions.delay || 0,
            repeatDelay: beamOptions.repeatDelay || 0,
          }}
          className={cn(
            "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-[#2D9A8F] via-[#2D9A8F] to-transparent",
            beamOptions.className
          )}
        />
      )}
      
      <AnimatePresence mode="wait">
        {collision && (
          <Explosion
            key={`explosion-${collision.x}-${collision.y}`}
            x={collision.x}
            y={collision.y}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ x, y }: { x: number; y: number }) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div
      className="absolute z-50 h-2 w-2 pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-[#1f7368] to-transparent blur-sm"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 0.8 + 0.3, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-[#2D9A8F] to-[#1f7368]"
        />
      ))}
    </div>
  );
};