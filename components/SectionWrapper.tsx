"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function SectionWrapper({
  children,
  fullWidth = false,
  className = "",
}: SectionWrapperProps) {
  if (fullWidth) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {children}
      </div>
    </div>
  );
}