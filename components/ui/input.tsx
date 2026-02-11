"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 150; 
    const [visible, setVisible] = React.useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    // FIX: Hook-urile trebuie apelate la nivelul de sus al componentei, nu condiționat
    const backgroundOverlay = useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        #2D9A8F 0%,
        rgba(45, 154, 143, 0.4) 50%,
        transparent 100%
      )
    `;

    const glowEffect = useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        #2D9A8F,
        transparent 80%
      )
    `;

    return (
      <motion.div
        style={{ background: backgroundOverlay }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[1.5px] transition duration-300 relative"
      >
        {/* Strat de Glow - Acum randat mereu, dar controlat prin 'visible' în interiorul template-ului */}
        <motion.div 
          className="absolute inset-0 rounded-lg blur-[6px] opacity-40 pointer-events-none"
          style={{ background: glowEffect }}
        />

        <input
          type={type}
          className={cn(
            `relative z-10 flex h-10 w-full rounded-md border-none bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-black dark:text-white transition duration-400 
            placeholder:text-neutral-400 
            focus-visible:ring-[2px] focus-visible:ring-[#2D9A8F] focus-visible:outline-none
            focus-visible:shadow-[0_0_15px_rgba(45,154,143,0.5)]
            disabled:cursor-not-allowed disabled:opacity-50 
            dark:shadow-[0px_0px_1px_1px_#404040]`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
Input.displayName = "Input";

export { Input };