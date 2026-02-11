"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/moving-border";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const navItems = [
    { name: "Acasă", href: "/" },
    { name: "Povestea noastră", href: "/despre-noi" },
    { name: "Servicii", href: "/servicii" },
    { name: "Portofoliu", href: "/portofoliu" },
    { name: "Blog", href: "/blog" },
  ];

  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
<header
        className={cn(
          "fixed z-50 transition-all duration-500 font-trebuchet left-0 right-0 mx-auto",
          // Fix pentru mobile: adăugăm margini laterale (inset-x-4) și top-4
          scrolled
            ? "top-4 inset-x-4 max-w-6xl bg-white/95 dark:bg-neutral-950/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-full px-2"
            : "top-0 inset-x-0 max-w-full bg-transparent border-b border-transparent px-0"
        )}
      >
      

        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <div className="flex h-20 sm:h-24 md:h-28 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 lg:gap-4 z-50 group flex-shrink-0">
              <motion.div whileHover={{ scale: 1.08, rotate: 3 }} whileTap={{ scale: 0.96 }} className="flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="SummitSphere"
                  width={100}
                  height={100}
                  className="w-18 sm:w-20 md:w-24 lg:w-25 h-auto object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Nav - LayoutId fixat */}
            <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
              {navItems.map((item, idx) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => setHovered(idx)}
                  className="relative px-4 py-2 text-base font-medium text-neutral-800 transition-colors duration-200 cursor-pointer"
                >
                  {(hovered === idx || pathname === item.href) && (
                    <motion.div
                      layoutId="navbar-active-bg-desktop" /* Am scos idx din ID pentru ca animația să "curgă" de la unul la altul */
                      className="absolute inset-0 bg-black/10 dark:bg-neutral-800/50 pointer-events-none"
                      style={{ borderRadius: "9999px" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Contact Button */}
            <div className="hidden lg:flex items-center">
              <Link href="/contact">
                <Button
                  borderRadius="1.75rem"
                  className="bg-white text-black border-neutral-200 px-6 py-2 font-medium"
                >
                  Contact
                </Button>
              </Link>
            </div>

            {/* Hamburger Mobile */}
            <motion.button
              className={cn(
                "lg:hidden p-2.5 rounded-xl z-50 transition-colors",
                scrolled || isOpen ? "bg-neutral-100/80" : "bg-white/50"
              )}
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-x-4 top-24 z-50 lg:hidden"
          >
            <div className="rounded-3xl border border-neutral-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl dark:border-neutral-800 dark:bg-black/95">
              <div className="flex flex-col gap-1">
                {navItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={`${item.name}-${item.href}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="relative flex items-center justify-between px-5 py-4 transition-all active:scale-95 z-10"
                      >
                        <span
                          className={cn(
                            "text-lg transition-colors",
                            isActive ? "text-black font-semibold" : "text-neutral-700"
                          )}
                        >
                          {item.name}
                        </span>

                        {isActive && (
                          <motion.div
                            layoutId="navbar-active-bg-mobile"
                            className="absolute inset-0 bg-black/10 dark:bg-neutral-800/50 -z-10 pointer-events-none"
                            style={{ borderRadius: "50px" }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}

                        <ArrowRight
                          size={18}
                          className={cn(
                            "transition-all duration-200",
                            isActive ? "opacity-100 translate-x-1 text-black" : "opacity-20 translate-x-0"
                          )}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-100 pt-5">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button
                    borderRadius="1.75rem"
                    className="w-full bg-white text-neutral-700 border-neutral-200 py-4 text-lg"
                  >
                    Contact
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}