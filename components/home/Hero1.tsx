"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function HeroSection() {
  return (
 <BackgroundBeamsWithCollision className="h-screen">
      <div className="text-center space-y-6">
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          Conectăm oameni{" "}
          <br/>
          <span style={{ color: "#2D9A8F" }} className="font-bold">
            Inspirăm soluții
          </span>
        </h2>

        <p className="text-lg md:text-xl text-black dark:text-white max-w-2xl mx-auto">
          Pentru un viitor mai sănătos
        </p>

        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Transformă-ți evenimentul într-o experiență memorabilă alături de noi!
        </p>

        <a
          href="#contact"
          className="inline-block px-8 py-3 bg-[#2D9A8F] hover:bg-[#2D9A8F] text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Contactează-ne
        </a>
      </div>
    </BackgroundBeamsWithCollision>
  );
}