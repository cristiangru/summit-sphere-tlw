"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { IconAppWindow } from "@tabler/icons-react";


export default function BackgroundGradientDemo() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
       
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
        Experiență premium
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-justify">
                         Gestionăm fiecare etapă a evenimentului tău, de la concept și logistică până la implementare
        </p>
  
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
       Soluții personalizate
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-justify">
                  Adaptăm conferințele și workshop-urile la nevoile tale și specificul fiecărei specialități medicale
        </p>
        
      </BackgroundGradient>
    </div>
  );
}
