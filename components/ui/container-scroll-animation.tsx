"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start animation when element enters viewport
      // End animation when element reaches top of screen
      const startTrigger = windowHeight; // Element enters from bottom
      const endTrigger = -element.clientHeight * 0.3; // Element leaves from top

      const rawProgress = (startTrigger - rect.top) / (startTrigger - endTrigger);
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getScaleDimensions = () => {
    if (isMobile) return [0.7, 0.95];
    if (isTablet) return [0.8, 0.98];
    return [1.05, 1];
  };

  const [minScale, maxScale] = getScaleDimensions();
  const currentScale = minScale + (maxScale - minScale) * scrollProgress;
  const currentRotate = 20 - 20 * scrollProgress;
  const currentTranslate = -100 * scrollProgress;

  return (
    <div
      className="h-auto min-h-[60vh] sm:min-h-[70vh] md:h-[50rem] lg:h-[60rem] flex items-center justify-center relative p-2 sm:p-4 md:p-10 mt-16 sm:mt-20 md:mt-32 lg:mt-40"
      ref={containerRef}
    >
      <div
        className="py-4 sm:py-8 md:py-14 w-full relative"
        style={{
          perspective: "1200px",
        }}
      >
        <Header
          translate={currentTranslate}
          titleComponent={titleComponent}
        />
        <Card
          rotate={currentRotate}
          translate={currentTranslate}
          scale={currentScale}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: number;
  titleComponent: React.ReactNode;
}) => {
  return (
    <div
      style={{
        transform: `translateY(${translate}px)`,
      }}
      className="w-full max-w-5xl mx-auto text-center mb-3 sm:mb-8 md:mb-12 lg:mb-16 px-2 sm:px-4"
    >
      {titleComponent}
    </div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: number;
  scale: number;
  translate: number;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        transform: `perspective(1200px) rotateX(${rotate}deg) scale(${scale})`,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto h-[20rem] sm:h-[25rem] md:h-[30rem] lg:h-[35rem] w-full border-[1.5px] sm:border-2 md:border-4 border-[#6C6C6C] p-1.5 sm:p-3 md:p-6 bg-[#222222] rounded-[15px] sm:rounded-[20px] md:rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-[12px] sm:rounded-[15px] md:rounded-2xl bg-gray-100 dark:bg-zinc-900 p-1 sm:p-2 md:p-4">
        {children}
      </div>
    </div>
  );
};