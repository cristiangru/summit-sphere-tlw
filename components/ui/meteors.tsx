"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type MeteorData = {
  delay: number;
  duration: number;
};

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [mounted, setMounted] = useState(false);
  const [meteorData, setMeteorData] = useState<MeteorData[]>([]);

  const meteorCount = number || 20;
  const meteors = new Array(meteorCount).fill(true);

  useEffect(() => {
    // Generate random values only on client
    const data = meteors.map(() => ({
      delay: Math.random() * 5,
      duration: Math.floor(Math.random() * (10 - 5) + 5),
    }));
    setMeteorData(data);
    setMounted(true);
  }, [meteorCount]);

  if (!mounted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {meteors.map((el, idx) => {
          const position = idx * (800 / meteorCount) - 400;
          return (
            <span
              key={"meteor" + idx}
              className={cn(
                "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
                "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
                className,
              )}
              style={{
                top: "-40px",
                left: position + "px",
                animationDelay: "0s",
                animationDuration: "5s",
              }}
            ></span>
          );
        })}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((el, idx) => {
        const position = idx * (800 / meteorCount) - 400;

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px",
              left: position + "px",
              animationDelay: (meteorData[idx]?.delay || 0) + "s",
              animationDuration: (meteorData[idx]?.duration || 5) + "s",
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};