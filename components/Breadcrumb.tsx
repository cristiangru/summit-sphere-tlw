// components/Breadcrumb.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex items-center gap-2 text-sm py-3 px-4 sm:px-6 lg:px-8 ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home icon – mic și discret */}
      <Link
        href="/"
        className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        aria-label="Acasă"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[180px] sm:max-w-none">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors truncate max-w-[160px] sm:max-w-none"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </motion.nav>
  );
}